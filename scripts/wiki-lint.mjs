#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const wikiDir = path.join(root, "wiki");
const manifestPath = path.join(root, "raw/.manifest.json");
const allowedTypes = new Set(["source", "entity", "concept", "comparison", "question", "overview", "meta"]);
const requiredKnowledgeFields = ["title", "type", "summary", "tags", "keywords", "sources", "updated", "protected"];
const expectedDirs = {
  source: "wiki/sources",
  entity: "wiki/entities",
  concept: "wiki/concepts",
  comparison: "wiki/comparisons",
  question: "wiki/questions",
};

const errors = [];
const warnings = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.isFile() && entry.name.endsWith(".md") ? [full] : [];
  });
}

function clean(value) {
  return String(value ?? "").trim().replace(/^["']|["']$/g, "");
}

function parseFrontmatter(text) {
  if (!text.startsWith("---\n")) return { data: {}, hasFrontmatter: false };
  const end = text.indexOf("\n---", 4);
  if (end === -1) return { data: {}, hasFrontmatter: false };
  const lines = text.slice(4, end).split(/\r?\n/);
  const data = {};
  let currentKey = null;

  for (const line of lines) {
    const keyValue = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    const listItem = line.match(/^\s*-\s*(.*)$/);
    if (keyValue) {
      currentKey = keyValue[1];
      const raw = keyValue[2].trim();
      if (raw === "[]") data[currentKey] = [];
      else if (raw.startsWith("[") && raw.endsWith("]")) {
        data[currentKey] = raw
          .slice(1, -1)
          .split(",")
          .map((value) => clean(value))
          .filter(Boolean);
      } else data[currentKey] = clean(raw);
    } else if (listItem && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      const value = clean(listItem[1]);
      if (value) data[currentKey].push(value);
    }
  }

  return { data, hasFrontmatter: true };
}

function rel(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

const files = walk(wikiDir);
const pages = new Map();
const titleToRel = new Map();
const stemToRel = new Map();

for (const file of files) {
  const relative = rel(file);
  const text = fs.readFileSync(file, "utf8");
  const { data, hasFrontmatter } = parseFrontmatter(text);
  pages.set(relative, { file, text, fm: data });
  stemToRel.set(path.basename(relative, ".md"), relative);
  if (data.title) titleToRel.set(data.title, relative);

  if (!hasFrontmatter) fail(`${relative}: missing frontmatter`);
  if (!data.type) fail(`${relative}: missing type`);
  else if (!allowedTypes.has(data.type)) fail(`${relative}: invalid type "${data.type}"`);
  if (data.updated && !/^\d{4}-\d{2}-\d{2}$/.test(String(data.updated))) {
    fail(`${relative}: updated must be YYYY-MM-DD`);
  }

  const isMeta = data.type === "meta";
  if (isMeta) {
    for (const field of ["title", "type", "updated"]) {
      if (!(field in data)) fail(`${relative}: missing meta field "${field}"`);
    }
    continue;
  }

  for (const field of requiredKnowledgeFields) {
    if (!(field in data)) fail(`${relative}: missing field "${field}"`);
  }

  if (data.type === "overview") continue;
  const expectedDir = expectedDirs[data.type];
  if (expectedDir && !relative.startsWith(`${expectedDir}/`)) {
    fail(`${relative}: ${data.type} pages must live in ${expectedDir}/`);
  }
  if (expectedDir) {
    const expectedPrefix = `${data.type}-`;
    const base = path.basename(relative);
    if (!base.startsWith(expectedPrefix)) fail(`${relative}: filename must start with ${expectedPrefix}`);
  }
}

for (const [relative, page] of pages) {
  const links = page.text.matchAll(/!?\[\[([^\]]+)\]\]/g);
  for (const match of links) {
    const rawTarget = match[1].split("|")[0].split("#")[0].trim();
    if (!rawTarget) continue;
    if (rawTarget.match(/\.(png|jpe?g|gif|webp|svg|pdf)$/i)) continue;
    if (!stemToRel.has(rawTarget) && !titleToRel.has(rawTarget)) {
      fail(`${relative}: broken wikilink [[${rawTarget}]]`);
    }
  }
}

const index = pages.get("wiki/index.md");
if (!index) {
  fail("wiki/index.md: missing");
} else {
  const indexed = new Set(
    index.text
      .split(/\r?\n/)
      .filter((line) => line.startsWith("| wiki/") && !line.includes(" | 파일 | "))
      .map((line) => line.split("|")[1].trim())
  );
  const knowledge = [...pages.entries()]
    .filter(([relative, page]) => {
      const base = path.basename(relative);
      return !["wiki/index.md", "wiki/log.md", "wiki/hot.md"].includes(relative) && base !== "_index.md" && page.fm.type !== "meta";
    })
    .map(([relative]) => relative);

  for (const relative of knowledge) {
    if (!indexed.has(relative)) fail(`wiki/index.md: missing row for ${relative}`);
  }
  for (const relative of indexed) {
    if (!pages.has(relative)) fail(`wiki/index.md: row points to missing file ${relative}`);
  }
}

try {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (manifest.version !== 1) warn("raw/.manifest.json: version should be 1");
  if (!manifest.sources || typeof manifest.sources !== "object" || Array.isArray(manifest.sources)) {
    fail("raw/.manifest.json: sources must be an object");
  } else {
    for (const [sourcePath, entry] of Object.entries(manifest.sources)) {
      if (!fs.existsSync(path.join(root, sourcePath))) fail(`manifest: missing raw source ${sourcePath}`);
      for (const field of ["sha256", "size", "ingested_at", "status", "pages_created", "pages_updated"]) {
        if (!(field in entry)) fail(`manifest ${sourcePath}: missing ${field}`);
      }
      for (const page of [...(entry.pages_created || []), ...(entry.pages_updated || [])]) {
        if (!fs.existsSync(path.join(root, page))) fail(`manifest ${sourcePath}: missing referenced file ${page}`);
      }
    }
  }
} catch (error) {
  fail(`raw/.manifest.json: invalid JSON (${error.message})`);
}

for (const message of errors) console.error(`ERROR ${message}`);
for (const message of warnings) console.warn(`WARN ${message}`);

console.log(`wiki-lint: ${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length > 0 ? 1 : 0);
