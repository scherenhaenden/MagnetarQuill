import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const TARGET_ROOTS = [
  'projects/lib-magnetar-quill/src/lib',
  'src/app'
];

async function main() {
  const files = (await Promise.all(TARGET_ROOTS.map(root => collectStyleFiles(path.join(ROOT, root))))).flat();
  const failures = [];

  for (const filePath of files) {
    const text = await fs.readFile(filePath, 'utf8');
    failures.push(...findDuplicateSelectors(text, filePath));
  }

  if (failures.length > 0) {
    failures.forEach(failure => console.error(failure));
    console.error(`Style lint failed with ${failures.length} issue(s).`);
    process.exit(1);
  }
}

async function collectStyleFiles(dirPath) {
  const entries = await fs.readdir(dirPath, {withFileTypes: true});
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectStyleFiles(entryPath));
      continue;
    }

    if (entry.name.endsWith('.less') || entry.name.endsWith('.css')) {
      files.push(entryPath);
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}

function findDuplicateSelectors(text, filePath) {
  const failures = [];
  const seenSelectors = new Map();
  const selectorStack = [];
  let pendingSelector = '';
  let line = 1;
  let selectorStartLine = 1;
  let inBlockComment = false;
  let inLineComment = false;
  let inString = null;

  for (let index = 0; index < text.length; index += 1) {
    const current = text[index];
    const next = text[index + 1];

    if (current === '\n') {
      line += 1;
      inLineComment = false;
    }

    if (inBlockComment) {
      if (current === '*' && next === '/') {
        inBlockComment = false;
        index += 1;
      }
      continue;
    }

    if (inLineComment) {
      continue;
    }

    if (!inString && current === '/' && next === '*') {
      inBlockComment = true;
      index += 1;
      continue;
    }

    if (!inString && current === '/' && next === '/') {
      inLineComment = true;
      index += 1;
      continue;
    }

    if (inString) {
      if (current === '\\') {
        index += 1;
        continue;
      }
      if (current === inString) {
        inString = null;
      }
      pendingSelector += current;
      continue;
    }

    if (current === '"' || current === "'") {
      inString = current;
      pendingSelector += current;
      continue;
    }

    if (current === '{') {
      const selector = normalizeSelector(pendingSelector);
      if (selector) {
        const fullSelector = [...selectorStack, selector].join(' ');
        const previousLine = seenSelectors.get(fullSelector);
        if (previousLine) {
          failures.push(`${relative(filePath)}:${selectorStartLine} Duplicate selector "${selector}", first used at line ${previousLine}.`);
        } else {
          seenSelectors.set(fullSelector, selectorStartLine);
        }
        selectorStack.push(selector);
      }
      pendingSelector = '';
      selectorStartLine = line;
      continue;
    }

    if (current === '}') {
      selectorStack.pop();
      pendingSelector = '';
      selectorStartLine = line;
      continue;
    }

    if (pendingSelector.length === 0 && current.trim().length > 0) {
      selectorStartLine = line;
    }
    pendingSelector += current;
  }

  return failures;
}

function normalizeSelector(selector) {
  return selector
    .split('\n')
    .map(part => part.trim())
    .join(' ')
    .replaceAll(/\s+/g, ' ')
    .trim();
}

function relative(filePath) {
  return path.relative(ROOT, filePath).replaceAll(path.sep, '/');
}

await main();
