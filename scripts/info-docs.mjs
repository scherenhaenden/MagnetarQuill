import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const ROOT = process.cwd();
const CHECK_MODE = process.argv.includes('--check');
const WRITE_MODE = process.argv.includes('--write');

if (!CHECK_MODE && !WRITE_MODE) {
  console.error('Usage: node scripts/info-docs.mjs --check | --write');
  process.exit(1);
}

const TARGET_ROOTS = [
  'projects/lib-magnetar-quill/src/lib',
  'src/app'
];

const GENERATED_TAG = '@generatedInfoDoc';

async function main() {
  const files = (await Promise.all(TARGET_ROOTS.map(root => collectTsFiles(path.join(ROOT, root))))).flat();
  let failureCount = 0;

  for (const filePath of files) {
    const originalText = await fs.readFile(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(filePath, originalText, ts.ScriptTarget.Latest, true);
    const entities = collectEntities(sourceFile);

    if (WRITE_MODE) {
      const updatedText = applyGeneratedDocs(originalText, sourceFile, entities, filePath);
      if (updatedText !== originalText) {
        await fs.writeFile(filePath, updatedText, 'utf8');
      }
      continue;
    }

    const failures = validateGeneratedDocs(originalText, sourceFile, entities, filePath);
    failureCount += failures.length;
    for (const failure of failures) {
      console.error(failure);
    }
  }

  if (CHECK_MODE && failureCount > 0) {
    console.error(`Info-doc validation failed with ${failureCount} issue(s).`);
    process.exit(1);
  }
}

async function collectTsFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectTsFiles(entryPath));
      continue;
    }

    if (!entry.name.endsWith('.ts') || entry.name.endsWith('.spec.ts')) {
      continue;
    }

    files.push(entryPath);
  }

  return files.sort((left, right) => left.localeCompare(right));
}

function collectEntities(sourceFile) {
  const entities = [];

  function collectClass(node) {
    entities.push(createEntity(node, sourceFile, 'class', node.name.text, null));
    for (const member of node.members) {
      visit(member, node.name.text);
    }
  }

  function collectEntity(node, ownerName) {
    const metadata = getEntityMetadata(node, ownerName);
    if (!metadata) {
      return false;
    }

    entities.push(createEntity(node, sourceFile, metadata.kind, metadata.name, metadata.ownerName));
    return true;
  }

  function visit(node, ownerName = null) {
    if (ts.isClassDeclaration(node) && node.name) {
      collectClass(node);
      return;
    }

    if (collectEntity(node, ownerName)) {
      return;
    }

    ts.forEachChild(node, child => visit(child, ownerName));
  }

  visit(sourceFile);
  return entities;
}

function getEntityMetadata(node, ownerName) {
  if (ts.isConstructorDeclaration(node)) {
    return { kind: 'constructor', name: 'constructor', ownerName };
  }

  if (ts.isMethodDeclaration(node) && node.name) {
    return { kind: 'method', name: getNodeName(node.name), ownerName };
  }

  if (ts.isGetAccessorDeclaration(node) && node.name) {
    return { kind: 'getter', name: getNodeName(node.name), ownerName };
  }

  if (ts.isSetAccessorDeclaration(node) && node.name) {
    return { kind: 'setter', name: getNodeName(node.name), ownerName };
  }

  if (ts.isFunctionDeclaration(node) && node.name) {
    return { kind: 'function', name: node.name.text, ownerName: null };
  }

  return null;
}

function createEntity(node, sourceFile, kind, name, ownerName) {
  const start = node.getStart(sourceFile, false);
  const fullStart = node.getFullStart();
  const lineStart = sourceFile.getLineAndCharacterOfPosition(start).line + 1;
  const bodyLineCount = getImplementationLineCount(node, sourceFile);

  return {
    node,
    kind,
    name,
    ownerName,
    start,
    fullStart,
    lineStart,
    bodyLineCount
  };
}

function getNodeName(nodeName) {
  if (ts.isIdentifier(nodeName) || ts.isStringLiteral(nodeName) || ts.isNumericLiteral(nodeName)) {
    return nodeName.text;
  }
  return nodeName.getText();
}

function getImplementationLineCount(node, sourceFile) {
  if (ts.isClassDeclaration(node)) {
    if (node.members.length === 0) {
      return 1;
    }

    const start = node.members.pos;
    const end = node.members.end;
    return countNonEmptyLines(sourceFile.text.slice(start, end));
  }

  const body = node.body;
  if (body) {
    return Math.max(1, countNonEmptyLines(sourceFile.text.slice(body.pos, body.end)));
  }

  return 1;
}

function countNonEmptyLines(text) {
  return stripComments(text)
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && line !== '{' && line !== '}')
    .length;
}

function handleBlockComment(current, next, index, state, append) {
  if (current === '*' && next === '/') {
    state.inBlockComment = false;
    return index + 2;
  }
  append(current === '\n' ? '\n' : ' ');
  return index + 1;
}

function handleLineComment(current, index, state, append) {
  if (current === '\n') {
    state.inLineComment = false;
    append(current);
  }
  return index + 1;
}

function handleNormalText(current, next, index, state, append) {
  if (current === '/' && next === '*') {
    state.inBlockComment = true;
    append('  ');
    return index + 2;
  }
  if (current === '/' && next === '/') {
    state.inLineComment = true;
    append('  ');
    return index + 2;
  }
  append(current);
  return index + 1;
}

function handleStringText(current, next, index, state, append) {
  if (current === '\\') {
    append(current);
    if (next) {
      append(next);
    }
    return index + 2;
  }

  if (current === state.inString) {
    state.inString = null;
  }
  append(current);
  return index + 1;
}

function handleTextOutsideComment(current, next, index, state, append) {
  if (current === '"' || current === "'" || current === '`') {
    state.inString = current;
    append(current);
    return index + 1;
  }

  return handleNormalText(current, next, index, state, append);
}

function handleCommentAwareText(text, index, state, append) {
  const current = text[index];
  const next = text[index + 1];

  if (state.inBlockComment) {
    return handleBlockComment(current, next, index, state, append);
  }
  if (state.inLineComment) {
    return handleLineComment(current, index, state, append);
  }
  if (state.inString) {
    return handleStringText(current, next, index, state, append);
  }

  return handleTextOutsideComment(current, next, index, state, append);
}

function stripComments(text) {
  let output = '';
  let index = 0;
  const state = { inBlockComment: false, inLineComment: false, inString: null };
  const append = (char) => {
    output += char;
  };

  while (index < text.length) {
    index = handleCommentAwareText(text, index, state, append);
  }

  return output;
}

function applyGeneratedDocs(text, sourceFile, entities, filePath) {
  const replacements = [];

  for (const entity of entities) {
    const generatedDoc = buildGeneratedDoc(entity, filePath);
    const existingRange = findGeneratedDocRange(text, entity);

    replacements.push({
      start: existingRange ? existingRange.pos : entity.start,
      end: existingRange ? existingRange.end : entity.start,
      text: generatedDoc
    });
  }

  replacements.sort((a, b) => b.start - a.start);

  let updatedText = text;
  for (const replacement of replacements) {
    updatedText = `${updatedText.slice(0, replacement.start)}${replacement.text}${updatedText.slice(replacement.end)}`;
  }

  return updatedText;
}

function validateGeneratedDocs(text, sourceFile, entities, filePath) {
  const failures = [];

  for (const entity of entities) {
    const range = findGeneratedDocRange(text, entity);
    if (!range) {
      failures.push(`${relative(filePath)}:${entity.lineStart} Missing generated info-doc for ${describeEntity(entity)}.`);
      continue;
    }

    const docLineCount = countGeneratedDocLines(text.slice(range.pos, range.end));
    if (docLineCount < 3) {
      failures.push(`${relative(filePath)}:${entity.lineStart} Generated info-doc for ${describeEntity(entity)} is incomplete.`);
    }
  }

  return failures;
}

function buildGeneratedDoc(entity, filePath) {
  const indent = getIndentation(entity);
  const label = describeEntity(entity);
  const lines = [
    `${GENERATED_TAG}`,
    `InfoDoc: ${label} is tracked by the generated documentation contract.`,
    `Location: \`${relative(filePath)}\`; regenerate with \`npm run docs:generate:info-docs\` when structure changes.`
  ];

  const docBody = lines.map(line => `${indent} * ${line}`).join('\n');
  return `${indent}/**\n${docBody}\n${indent} */\n`;
}

function getIndentation(entity) {
  const sourceText = entity.node.getSourceFile().text;
  const lineStartPos = sourceText.lastIndexOf('\n', entity.start - 1) + 1;
  return sourceText.slice(lineStartPos, entity.start).match(/^\s*/)?.[0] ?? '';
}

function findGeneratedDocRange(text, entity) {
  const leadingRanges = ts.getLeadingCommentRanges(text, entity.fullStart) ?? [];

  for (const range of leadingRanges) {
    const commentText = text.slice(range.pos, range.end);
    if (commentText.includes(GENERATED_TAG)) {
      return range;
    }
  }

  return null;
}

function countGeneratedDocLines(commentText) {
  return commentText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('*') && line !== '*' && line !== '*/' && !line.startsWith('/**'))
    .length;
}

function describeEntity(entity) {
  const ownerPrefix = entity.ownerName ? `\`${entity.ownerName}\`.` : '';
  switch (entity.kind) {
    case 'class':
      return `class \`${entity.name}\``;
    case 'constructor':
      return `constructor for class \`${entity.ownerName}\``;
    case 'method':
      return `method ${ownerPrefix}\`${entity.name}()\``;
    case 'getter':
      return `getter ${ownerPrefix}\`${entity.name}\``;
    case 'setter':
      return `setter ${ownerPrefix}\`${entity.name}\``;
    case 'function':
      return `function \`${entity.name}()\``;
    default:
      return `entity \`${entity.name}\``;
  }
}

function relative(filePath) {
  return path.relative(ROOT, filePath).replaceAll(path.sep, '/');
}

await main();
