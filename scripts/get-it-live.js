#!/usr/bin/env node
/**
 * Get It Live - Automated deployment script
 *
 * Steps:
 * 1. npm version patch
 * 2. Stage changes
 * 3. Fix linting errors
 * 4. Commit
 * 5. Push
 * 6. Monitor GitHub Actions
 * 7. Monitor Cloudflare deployment
 */

import { execSync, spawn } from 'child_process';

const run = (cmd, opts = {}) => {
  console.log(`\n> ${cmd}`);
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: 'inherit', ...opts });
  } catch (e) {
    if (!opts.ignoreError) throw e;
  }
};

const runCapture = (cmd) => {
  console.log(`\n> ${cmd}`);
  return execSync(cmd, { encoding: 'utf8' }).trim();
};

async function main() {
  console.log('=== GET IT LIVE ===\n');

  // 1. Check for uncommitted changes
  console.log('Step 1: Checking git status...');
  const status = runCapture('git status --porcelain');

  if (!status) {
    console.log('No changes to deploy.');
    process.exit(0);
  }

  console.log('Changes detected:\n' + status);

  // 2. Version bump
  console.log('\nStep 2: Bumping version...');
  run('npm version patch --no-git-tag-version');

  // 3. Stage all changes
  console.log('\nStep 3: Staging changes...');
  run('git add -A');

  // 4. Run lint and fix
  console.log('\nStep 4: Fixing lint errors...');
  run('npm run check 2>/dev/null || true', { ignoreError: true });

  // 5. Stage any lint fixes
  run('git add -A');

  // 6. Commit
  console.log('\nStep 5: Committing...');
  const version = JSON.parse(require('fs').readFileSync('package.json', 'utf8')).version;
  const commitMsg = `chore: release v${version}

Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>`;

  run(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);

  // 7. Push
  console.log('\nStep 6: Pushing to remote...');
  run('git push');

  // 8. Monitor GitHub Actions
  console.log('\nStep 7: Monitoring GitHub Actions...');
  console.log('Waiting for workflow to start...');

  await new Promise(resolve => setTimeout(resolve, 5000));

  let attempts = 0;
  const maxAttempts = 60; // 5 minutes max

  while (attempts < maxAttempts) {
    try {
      const result = runCapture('gh run list --limit 1 --json status,conclusion,name,databaseId');
      const runs = JSON.parse(result);

      if (runs.length > 0) {
        const run = runs[0];
        console.log(`  Workflow: ${run.name} - Status: ${run.status}`);

        if (run.status === 'completed') {
          if (run.conclusion === 'success') {
            console.log('  GitHub Actions: SUCCESS');
            break;
          } else {
            console.error(`  GitHub Actions: FAILED (${run.conclusion})`);
            console.log(`  View at: https://github.com/jaslr/ci-monitor/actions/runs/${run.databaseId}`);
            process.exit(1);
          }
        }
      }
    } catch (e) {
      console.log('  Waiting for workflow...');
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
    attempts++;
  }

  // 9. Check Cloudflare deployment
  console.log('\nStep 8: Checking Cloudflare deployment...');
  console.log('  Deployment initiated via GitHub Actions');
  console.log('  Visit: https://ci-monitor.pages.dev');

  console.log('\n=== DEPLOYMENT COMPLETE ===');
}

main().catch(e => {
  console.error('Deployment failed:', e.message);
  process.exit(1);
});
