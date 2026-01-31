/**
 * NPM Tools
 * Package management and script execution
 */

import { execSync, spawn } from 'child_process';

function runCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf-8',
      cwd: process.cwd(),
      timeout: options.timeout || 60000,
      ...options
    });
    return { success: true, output: result };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stdout: error.stdout,
      stderr: error.stderr,
      exitCode: error.status
    };
  }
}

export const npmTools = {
  lint: {
    name: 'npm:lint',
    description: 'Run linting checks',
    
    async execute(options = {}) {
      return runCommand('npm run lint', { timeout: 120000, ...options });
    }
  },
  
  build: {
    name: 'npm:build',
    description: 'Build the project',
    
    async execute(options = {}) {
      return runCommand('npm run build', { timeout: 300000, ...options });
    }
  },
  
  test: {
    name: 'npm:test',
    description: 'Run test suite',
    
    async execute(options = {}) {
      const testCommand = options.pattern
        ? `npm test -- --grep "${options.pattern}"`
        : 'npm test';
      return runCommand(testCommand, { timeout: 300000, ...options });
    }
  },
  
  audit: {
    name: 'npm:audit',
    description: 'Check for security vulnerabilities',
    
    async execute(options = {}) {
      const result = runCommand('npm audit --json', options);
      
      if (result.success || result.stdout) {
        try {
          const audit = JSON.parse(result.stdout || result.output);
          return {
            success: true,
            vulnerabilities: audit.metadata?.vulnerabilities || {},
            advisories: Object.keys(audit.advisories || {}).length,
            raw: audit
          };
        } catch (e) {
          return result;
        }
      }
      
      return result;
    }
  },
  
  outdated: {
    name: 'npm:outdated',
    description: 'Check for outdated packages',
    
    async execute(options = {}) {
      const result = runCommand('npm outdated --json', options);
      
      try {
        const outdated = JSON.parse(result.stdout || result.output || '{}');
        const packages = Object.entries(outdated).map(([name, info]) => ({
          name,
          current: info.current,
          wanted: info.wanted,
          latest: info.latest,
          type: info.type
        }));
        
        return {
          success: true,
          count: packages.length,
          packages
        };
      } catch (e) {
        return { success: true, count: 0, packages: [] };
      }
    }
  },
  
  update: {
    name: 'npm:update',
    description: 'Update packages',
    
    async execute(packageName, options = {}) {
      if (options.dryRun) {
        return runCommand(`npm update ${packageName || ''} --dry-run`, options);
      }
      return runCommand(`npm update ${packageName || ''}`, options);
    }
  }
};
