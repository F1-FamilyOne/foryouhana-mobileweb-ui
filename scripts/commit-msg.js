import fs from 'fs';

const msgFile = process.argv[2];
const message = fs.readFileSync(msgFile, 'utf8').trim();

// merge commit
if (/^Merge\b/.test(message)) {
  process.exit(0);
}

// revert 커밋
if (/^Revert\b/.test(message)) {
  process.exit(0);
}

const pattern = /^(feat|fix|build|chore|docs|style|refactor|test): .+ #\d+$/;

if (!pattern.test(message)) {
  console.error(`
❌ Invalid commit message format

Expected:
  Type: 제목 #이슈번호

Allowed types:
  feat | fix | build | chore | docs | style | refactor | test

Examples:
  chore: dev-setting #2
  feat: gift-tax modal logic #13
`);
  process.exit(1);
}
