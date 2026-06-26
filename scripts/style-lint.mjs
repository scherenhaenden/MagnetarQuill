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

function handleBlockComment(current, next, index, state) {
  if (current === '*' && next === '/') {
    state.inBlockComment = false;
    return index + 2;
  }
  return index + 1;
}

function handleString(current, index, state) {
  if (current === '\\') {
    return index + 2;
  }
  if (current === state.inString) {
    state.inString = null;
  }
  state.pendingSelector += current;
  return index + 1;
}

function processOpenBrace(state, filePath) {
  const selector = normalizeSelector(state.pendingSelector);
  if (selector) {
    const fullSelector = [...state.selectorStack, selector].join(' ');
    const previousLine = state.seenSelectors.get(fullSelector);
    if (previousLine) {
      state.failures.push(`${relative(filePath)}:${state.selectorStartLine} Duplicate selector "${selector}", first used at line ${previousLine}.`);
    } else {
      state.seenSelectors.set(fullSelector, state.selectorStartLine);
    }
    state.selectorStack.push(selector);
  }
  state.pendingSelector = '';
  state.selectorStartLine = state.line;
}

function handleSelectorsAndBraces(current, index, state, filePath) {
  if (current === '{') {
    processOpenBrace(state, filePath);
    return index + 1;
  }

  if (current === '}') {
    state.selectorStack.pop();
    state.pendingSelector = '';
    state.selectorStartLine = state.line;
    return index + 1;
  }

  if (state.pendingSelector.length === 0 && current.trim().length > 0) {
    state.selectorStartLine = state.line;
  }
  state.pendingSelector += current;
  return index + 1;
}

function handleNormal(current, next, index, state, filePath) {
  if (current === '/' && next === '*') {
    state.inBlockComment = true;
    return index + 2;
  }

  if (current === '/' && next === '/') {
    state.inLineComment = true;
    return index + 2;
  }

  if (current === '"' || current === "'") {
    state.inString = current;
    state.pendingSelector += current;
    return index + 1;
  }

  return handleSelectorsAndBraces(current, index, state, filePath);
}

function findDuplicateSelectors(text, filePath) {
  const state = {
    failures: [],
    seenSelectors: new Map(),
    selectorStack: [],
    pendingSelector: '',
    line: 1,
    selectorStartLine: 1,
    inBlockComment: false,
    inLineComment: false,
    inString: null,
  };

  let index = 0;
  while (index < text.length) {
    const current = text[index];
    const next = text[index + 1];

    if (current === '\n') {
      state.line += 1;
      state.inLineComment = false;
    }

    if (state.inBlockComment) {
      index = handleBlockComment(current, next, index, state);
    } else if (state.inLineComment) {
      index += 1;
    } else if (state.inString) {
      index = handleString(current, index, state);
    } else {
      index = handleNormal(current, next, index, state, filePath);
    }
  }

  return state.failures;
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
