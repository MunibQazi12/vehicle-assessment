#!/usr/bin/env node

/**
 * Vercel Ignored Build Step Script
 * 
 * This script determines whether a build should be triggered based on the files that changed.
 * 
 * Logic:
 * - If ANY files outside dealers/* changed → BUILD (exit 1)
 * - If ONLY files in dealers/{specific-dealer-id}/* changed → SKIP (exit 0)
 * - If files in multiple dealer directories changed → BUILD (exit 1)
 * - If no changes detected → BUILD (exit 1, fallback to safe behavior)
 * 
 * Usage in vercel.json:
 * {
 *   "ignoreCommand": "node scripts/check-build-required.js"
 * }
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require('child_process');

/**
 * Get list of changed files between current commit and previous deployment
 * @returns {string[]} Array of changed file paths
 */
function getChangedFiles() {
  try {
    // Use Vercel's VERCEL_GIT_PREVIOUS_SHA if available
    const previousSha = process.env.VERCEL_GIT_PREVIOUS_SHA || 'HEAD^1';
    const currentSha = process.env.VERCEL_GIT_COMMIT_SHA || 'HEAD';
    
    console.log(`Checking changes between ${previousSha} and ${currentSha}...`);
    
    const output = execSync(
      `git diff --name-only ${previousSha} ${currentSha}`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    
    return output
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);
  } catch (error) {
    console.error('Error getting changed files:', error.message);
    // If we can't determine changes, build to be safe
    return [];
  }
}

/**
 * Analyze changed files and determine if build should run
 * @param {string[]} changedFiles - Array of changed file paths
 * @returns {boolean} - true if build is required, false if can skip
 */
function shouldBuild(changedFiles) {
  if (!changedFiles || changedFiles.length === 0) {
    console.log('⚠️  No changed files detected. Building to be safe.');
    return true;
  }

  console.log(`\n📁 Changed files (${changedFiles.length}):`);
  changedFiles.forEach(file => console.log(`   - ${file}`));

  const dealerPattern = /^dealers\/([^\/]+)\//;
  const affectedDealers = new Set();
  let hasNonDealerChanges = false;

  for (const file of changedFiles) {
    // Ignore .md files (documentation changes)
    if (file.endsWith('.md')) {
      console.log(`   └─ Documentation file (ignored)`);
      continue;
    }

    const match = file.match(dealerPattern);
    
    if (match) {
      // File is in dealers/{dealer-id}/
      const dealerId = match[1];
      affectedDealers.add(dealerId);
      console.log(`   └─ Affects dealer: ${dealerId}`);
    } else {
      // File is outside dealers/ directory
      hasNonDealerChanges = true;
      console.log(`   └─ Core application file (requires build)`);
    }
  }

  // Decision logic
  if (hasNonDealerChanges) {
    console.log('\n✅ BUILD REQUIRED: Core application files changed');
    return true;
  }

  if (affectedDealers.size === 0) {
    console.log('\n✅ BUILD REQUIRED: Changes detected but no dealer files found');
    return true;
  }

  if (affectedDealers.size === 1) {
    const dealerId = Array.from(affectedDealers)[0];
    console.log(`\n⏭️  BUILD SKIPPED: Only dealer ${dealerId} files changed`);
    console.log('   Other dealers are unaffected and will continue using cached builds.');
    return false;
  }

  if (affectedDealers.size > 1) {
    console.log(`\n✅ BUILD REQUIRED: Multiple dealers affected (${Array.from(affectedDealers).join(', ')})`);
    return true;
  }

  // Fallback to building
  console.log('\n✅ BUILD REQUIRED: Unable to determine scope of changes');
  return true;
}

/**
 * Check if build is required for a specific dealer project
 * @param {string[]} changedFiles - Array of changed file paths
 * @param {string} targetDealerId - Dealer ID to build for (from VERCEL_DEALER_ID env)
 * @returns {boolean} - true if build is required, false if can skip
 */
function shouldBuildForDealer(changedFiles, targetDealerId) {
  if (!changedFiles || changedFiles.length === 0) {
    console.log('⚠️  No changed files detected. Building to be safe.');
    return true;
  }

  console.log(`\n📁 Changed files (${changedFiles.length}):`);
  changedFiles.forEach(file => console.log(`   - ${file}`));

  const dealerPattern = /^dealers\/([^\/]+)\//;
  let hasTargetDealerChanges = false;
  let hasNonDealerChanges = false;

  for (const file of changedFiles) {
    // Ignore .md files (documentation changes)
    if (file.endsWith('.md')) {
      console.log(`   └─ Documentation file (ignored)`);
      continue;
    }

    const match = file.match(dealerPattern);
    
    if (match) {
      const dealerId = match[1];
      if (dealerId === targetDealerId) {
        hasTargetDealerChanges = true;
        console.log(`   └─ Target dealer file (${dealerId})`);
      } else {
        console.log(`   └─ Other dealer file (${dealerId}) - IGNORED`);
      }
    } else {
      // File is outside dealers/ directory
      hasNonDealerChanges = true;
      console.log(`   └─ Core application file (requires build)`);
    }
  }

  // Decision logic for dealer-specific project
  if (hasNonDealerChanges) {
    console.log(`\n✅ BUILD REQUIRED: Core application files changed`);
    return true;
  }

  if (hasTargetDealerChanges) {
    console.log(`\n✅ BUILD REQUIRED: Target dealer ${targetDealerId} files changed`);
    return true;
  }

  console.log(`\n⏭️  BUILD SKIPPED: No changes affecting dealer ${targetDealerId}`);
  console.log('   Only other dealers were modified.');
  return false;
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Vercel Build Skip Check\n');
  console.log('Environment:');
  console.log(`   Branch: ${process.env.VERCEL_GIT_COMMIT_REF || 'unknown'}`);
  console.log(`   Commit: ${process.env.VERCEL_GIT_COMMIT_SHA || 'unknown'}`);
  console.log(`   Previous: ${process.env.VERCEL_GIT_PREVIOUS_SHA || 'unknown'}`);
  
  const targetDealerId = process.env.NEXTJS_APP_DEALER_ID;
  
  if (targetDealerId) {
    console.log(`   Dealer ID: ${targetDealerId} (dealer-specific deployment)`);
  } else {
    console.log(`   Dealer ID: (not set - multi-tenant deployment)`);
  }
  console.log('');

  const changedFiles = getChangedFiles();
  let buildRequired;

  if (targetDealerId) {
    // Dealer-specific project: only build if this dealer's files or core files changed
    buildRequired = shouldBuildForDealer(changedFiles, targetDealerId);
  } else {
    // Multi-tenant project: use original logic
    buildRequired = shouldBuild(changedFiles);
  }

  // Exit code determines if Vercel should build
  // Exit 1 = Build
  // Exit 0 = Skip build
  const exitCode = buildRequired ? 1 : 0;
  
  console.log(`\n📊 Result: Exit code ${exitCode} (${buildRequired ? 'BUILD' : 'SKIP'})\n`);
  
  process.exit(exitCode);
}

// Run the script
main();
