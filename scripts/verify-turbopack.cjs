#!/usr/bin/env node

/**
 * Turbopack Configuration Verification Script
 * 
 * This script verifies that:
 * 1. Turbopack configuration is properly set up
 * 2. No Node.js modules are being imported in client components
 * 3. Browser targets are correctly configured
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

console.log('🔍 Verifying Turbopack Configuration...\n');

let hasErrors = false;

// Check 1: Verify next.config.ts has turbopack configuration
console.log('✓ Checking next.config.ts...');
try {
  const configPath = path.join(__dirname, '..', 'next.config.ts');
  const configContent = fs.readFileSync(configPath, 'utf-8');
  
  if (!configContent.includes('turbopack:')) {
    console.error('  ❌ Missing turbopack configuration');
    hasErrors = true;
  } else {
    console.log('  ✓ Turbopack configuration found');
  }
  
  if (!configContent.includes('resolveAlias:')) {
    console.error('  ❌ Missing resolveAlias configuration');
    hasErrors = true;
  } else {
    console.log('  ✓ resolveAlias configuration found');
  }
} catch (error) {
  console.error('  ❌ Error reading next.config.ts:', error.message);
  hasErrors = true;
}

// Check 2: Verify empty.js exists
console.log('\n✓ Checking empty.js...');
try {
  const emptyPath = path.join(__dirname, '..', 'empty.js');
  if (!fs.existsSync(emptyPath)) {
    console.error('  ❌ empty.js not found (required for resolveAlias)');
    hasErrors = true;
  } else {
    console.log('  ✓ empty.js exists');
  }
} catch (error) {
  console.error('  ❌ Error checking empty.js:', error.message);
  hasErrors = true;
}

// Check 3: Verify browserslist configuration
console.log('\n✓ Checking browserslist...');
try {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  
  if (!packageJson.browserslist) {
    console.error('  ❌ Missing browserslist configuration');
    hasErrors = true;
  } else {
    console.log('  ✓ browserslist configuration found');
    console.log('    Production targets:', packageJson.browserslist.production.join(', '));
  }
} catch (error) {
  console.error('  ❌ Error reading package.json:', error.message);
  hasErrors = true;
}

// Check 4: Scan for problematic imports in client components
console.log('\n✓ Scanning for Node.js imports in client components...');
const nodeModules = ['fs', 'path', 'crypto', 'http', 'https', 'os', 'stream', 'util', 'buffer', 'zlib'];
const problematicFiles = [];

function scanDirectory(dir, isClientComponent = false) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Skip node_modules, .next, scripts, and hidden directories
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git' || entry.name === 'scripts' || entry.name.startsWith('.')) {
      continue;
    }
    
    if (entry.isDirectory()) {
      scanDirectory(fullPath, isClientComponent);
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.jsx') || entry.name.endsWith('.js')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const hasUseClient = content.includes("'use client'") || content.includes('"use client"');
        
        if (hasUseClient) {
          // Check for Node.js module imports
          for (const mod of nodeModules) {
            const importRegex = new RegExp(`import\\s+.*from\\s+['"]${mod}['"]`, 'g');
            const requireRegex = new RegExp(`require\\(['"]${mod}['"]\\)`, 'g');
            
            if (importRegex.test(content) || requireRegex.test(content)) {
              problematicFiles.push({
                file: fullPath.replace(path.join(__dirname, '..'), ''),
                module: mod
              });
            }
          }
        }
      } catch {
        // Skip files we can't read
      }
    }
  }
}

try {
  const projectRoot = path.join(__dirname, '..');
  scanDirectory(projectRoot);
  
  if (problematicFiles.length > 0) {
    console.error('  ❌ Found Node.js imports in client components:');
    problematicFiles.forEach(({ file, module }) => {
      console.error(`    - ${file} imports '${module}'`);
    });
    hasErrors = true;
  } else {
    console.log('  ✓ No problematic imports found');
  }
} catch (error) {
  console.warn('  ⚠️  Could not scan files:', error.message);
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.error('❌ Verification FAILED - Please fix the issues above');
  process.exit(1);
} else {
  console.log('✅ Verification PASSED - Turbopack is properly configured!');
  console.log('\nNext steps:');
  console.log('  1. Run: npm run dev');
  console.log('  2. Check startup logs for "Turbopack"');
  console.log('  3. Build: npm run build');
  console.log('  4. Analyze bundle: npm run build:analyze');
}
console.log('='.repeat(50));
