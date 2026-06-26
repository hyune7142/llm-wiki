#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const wikiDir = path.join(root, "wiki");
const today = new Date().toISOString().slice(0, 10);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.isFile() && entry.name.endsWith(".md") ? [full] : [];
  });
}

function parseFrontmatter(text) {
  if (!text.startsWith("---\n")) return {};
  const end = text.indexOf("\n---", 4);
  if (end === -1) return {};
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
  return data;
}

function clean(value) {
  return String(value ?? "").trim().replace(/^["']|["']$/g, "");
}

function formatList(value) {
  if (!value) return "";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

const knowledgeFiles = walk(wikiDir)
  .filter((file) => {
    const rel = path.relative(root, file);
    const base = path.basename(file);
    return !["wiki/index.md", "wiki/log.md", "wiki/hot.md"].includes(rel) && base !== "_index.md";
  })
  .map((file) => {
    const rel = path.relative(root, file).replaceAll(path.sep, "/");
    const fm = parseFrontmatter(fs.readFileSync(file, "utf8"));
    return { rel, fm };
  })
  .filter(({ fm }) => fm.type !== "meta")
  .sort((a, b) => a.rel.localeCompare(b.rel));

const rows = knowledgeFiles.map(({ rel, fm }) => {
  return `| ${rel} | ${fm.title || ""} | ${fm.type || ""} | ${formatList(fm.tags)} | ${formatList(fm.keywords)} | ${fm.summary || ""} | ${fm.updated || ""} |`;
});

const content = `---
type: meta
title: "위키 인덱스"
updated: ${today}
---

# 위키 인덱스

> Claude가 관리하는 전체 페이지 테이블. 새 페이지가 생길 때마다 자동 업데이트.
> **query 시 이 테이블의 태그·키워드·요약 열로 관련 페이지를 판단하고, 필요한 페이지만 전체 읽기.**

| 파일 | 제목 | 타입 | 태그 | 키워드 | 요약 | updated |
|---|---|---|---|---|---|---|
${rows.join("\n")}

---

*마지막 업데이트: ${today}*
`;

fs.writeFileSync(path.join(wikiDir, "index.md"), content);
console.log(`wiki/index.md synced (${rows.length} page${rows.length === 1 ? "" : "s"})`);
