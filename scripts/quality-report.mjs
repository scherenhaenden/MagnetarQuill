import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'reports', 'quality');
const STEP_TIMEOUT_MS = 10 * 60 * 1000;

const STEPS = [
  {
    name: 'Info docs lint',
    command: 'npm',
    args: ['run', 'lint:info-docs'],
  },
  {
    name: 'Style lint',
    command: 'npm',
    args: ['run', 'lint:styles'],
  },
  {
    name: 'Angular lint',
    command: 'npx',
    args: ['ng', 'lint'],
  },
  {
    name: 'Library tests with coverage',
    command: 'npx',
    args: ['ng', 'test', 'lib-magnetar-quill', '--watch=false', '--code-coverage', '--browsers=ChromeHeadless', '--no-progress'],
  },
  {
    name: 'Library build',
    command: 'npm',
    args: ['run', 'build-lib'],
  },
  {
    name: 'Application build',
    command: 'npm',
    args: ['run', 'build'],
  },
];

function timestampForFile(date) {
  return date.toISOString().replaceAll(':', '-').replaceAll('.', '-');
}

function formatDuration(milliseconds) {
  return `${(milliseconds / 1000).toFixed(2)}s`;
}

function ensureReportDir() {
  fs.mkdirSync(REPORT_DIR, {recursive: true});
}

function logPathFor(stepName, startedAt) {
  const safeName = stepName.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/^-|-$/g, '');
  return path.join(REPORT_DIR, `${timestampForFile(startedAt)}-${safeName}.log`);
}

function runStep(step) {
  const startedAt = new Date();
  const started = performance.now();
  const result = spawnSync(step.command, step.args, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: false,
    timeout: STEP_TIMEOUT_MS,
  });
  const durationMs = performance.now() - started;
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  const logPath = logPathFor(step.name, startedAt);
  fs.writeFileSync(logPath, output, 'utf8');

  process.stdout.write(`\n[${result.status === 0 ? 'PASS' : 'FAIL'}] ${step.name} (${formatDuration(durationMs)})\n`);
  process.stdout.write(output);

  return {
    ...step,
    status: result.status ?? 1,
    durationMs,
    logPath,
    output,
  };
}

function parseCoverageSummary(testOutput) {
  const coverageRows = [];
  const rowPattern = /^(Statements|Branches|Functions|Lines)\s+:\s+([\d.]+)%\s+\(\s*(\d+)\/(\d+)\s*\)/gm;
  let match = rowPattern.exec(testOutput);
  while (match) {
    coverageRows.push({
      metric: match[1],
      percent: match[2],
      covered: match[3],
      total: match[4],
    });
    match = rowPattern.exec(testOutput);
  }
  return coverageRows;
}

function parseLcovFallback() {
  const lcovPath = path.join(ROOT, 'coverage', 'lib-magnetar-quill', 'lcov.info');
  if (!fs.existsSync(lcovPath)) {
    return [];
  }

  const totals = {linesFound: 0, linesHit: 0, functionsFound: 0, functionsHit: 0, branchesFound: 0, branchesHit: 0};
  const text = fs.readFileSync(lcovPath, 'utf8');
  for (const line of text.split('\n')) {
    addLcovLineToTotals(line, totals);
  }

  return [
    createCoverageRow('Lines', totals.linesHit, totals.linesFound),
    createCoverageRow('Functions', totals.functionsHit, totals.functionsFound),
    createCoverageRow('Branches', totals.branchesHit, totals.branchesFound),
  ];
}

function addLcovLineToTotals(line, totals) {
  const lcovFields = {
    'LF:': 'linesFound',
    'LH:': 'linesHit',
    'FNF:': 'functionsFound',
    'FNH:': 'functionsHit',
    'BRF:': 'branchesFound',
    'BRH:': 'branchesHit',
  };

  const field = Object.entries(lcovFields).find(([prefix]) => line.startsWith(prefix));
  if (!field) {
    return;
  }

  const [prefix, key] = field;
  totals[key] += Number.parseInt(line.slice(prefix.length), 10);
}

function createCoverageRow(metric, covered, total) {
  const percent = total === 0 ? '0.00' : ((covered / total) * 100).toFixed(2);
  return {metric, percent, covered: String(covered), total: String(total)};
}

function markdownStatus(status) {
  return status === 0 ? 'PASS' : 'FAIL';
}

function relative(filePath) {
  return path.relative(ROOT, filePath).replaceAll(path.sep, '/');
}

function buildReport(results, coverageRows, reportStartedAt) {
  const failed = results.some(result => result.status !== 0);
  const lines = [
    '# Quality Report',
    '',
    `Generated: ${reportStartedAt.toISOString()}`,
    `Overall status: ${failed ? 'FAIL' : 'PASS'}`,
    '',
    '## Checks',
    '',
    '| Check | Status | Duration | Log |',
    '| --- | --- | ---: | --- |',
  ];

  for (const result of results) {
    lines.push(`| ${result.name} | ${markdownStatus(result.status)} | ${formatDuration(result.durationMs)} | ${relative(result.logPath)} |`);
  }

  lines.push('', '## Coverage', '');
  if (coverageRows.length === 0) {
    lines.push('Coverage summary was not available.');
  } else {
    lines.push('| Metric | Percent | Covered | Total |', '| --- | ---: | ---: | ---: |');
    for (const row of coverageRows) {
      lines.push(`| ${row.metric} | ${row.percent}% | ${row.covered} | ${row.total} |`);
    }
  }

  lines.push('', '## Command', '', '`npm run quality:report`', '');
  return lines.join('\n');
}

function writeReport(report) {
  const timestamp = timestampForFile(new Date());
  const reportPath = path.join(REPORT_DIR, `quality-report-${timestamp}.md`);
  const latestPath = path.join(REPORT_DIR, 'latest.md');
  fs.writeFileSync(reportPath, report, 'utf8');
  fs.writeFileSync(latestPath, report, 'utf8');
  return {reportPath, latestPath};
}

ensureReportDir();
const reportStartedAt = new Date();
const results = STEPS.map(runStep);
const testResult = results.find(result => result.name === 'Library tests with coverage');
const coverageRows = parseCoverageSummary(testResult?.output ?? '');
const report = buildReport(results, coverageRows.length > 0 ? coverageRows : parseLcovFallback(), reportStartedAt);
const {reportPath, latestPath} = writeReport(report);
const failed = results.some(result => result.status !== 0);

process.stdout.write(`\nQuality report: ${relative(reportPath)}\n`);
process.stdout.write(`Latest report: ${relative(latestPath)}\n`);

process.exit(failed ? 1 : 0);
