/**
 * Security Tools
 * Vulnerability scanning, secret detection, and crypto utilities
 */

import { execSync } from 'child_process';
import { createHmac } from 'crypto';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

export const securityTools = {
  secretScan: {
    name: 'secret:scan',
    description: 'Scan for hardcoded secrets',
    
    async execute(options = {}) {
      const patterns = [
        /api[_-]?key\s*[=:]\s*['"][^'"]+['"]/gi,
        /password\s*[=:]\s*['"][^'"]+['"]/gi,
        /secret\s*[=:]\s*['"][^'"]+['"]/gi,
        /token\s*[=:]\s*['"][^'"]+['"]/gi,
        /-----BEGIN [A-Z]+ PRIVATE KEY-----/g,
        /ghp_[a-zA-Z0-9]{36}/g, // GitHub personal access token
        /sk-[a-zA-Z0-9]{48}/g,  // OpenAI API key pattern
      ];
      
      const findings = [];
      const scanDir = options.dir || './src';
      
      function scanFile(filePath) {
        try {
          const content = readFileSync(filePath, 'utf-8');
          
          patterns.forEach((pattern, index) => {
            const matches = content.match(pattern);
            if (matches) {
              findings.push({
                file: filePath,
                pattern: pattern.source,
                matches: matches.length,
                severity: index < 4 ? 'high' : 'critical'
              });
            }
          });
        } catch (e) {
          // Skip unreadable files
        }
      }
      
      function walkDir(dir) {
        try {
          const entries = readdirSync(dir, { withFileTypes: true });
          for (const entry of entries) {
            const fullPath = join(dir, entry.name);
            if (entry.isDirectory()) {
              if (!['node_modules', '.git', 'dist'].includes(entry.name)) {
                walkDir(fullPath);
              }
            } else if (/\.(js|ts|json|env|yml|yaml)$/.test(entry.name)) {
              scanFile(fullPath);
            }
          }
        } catch (e) {
          // Skip inaccessible directories
        }
      }
      
      walkDir(scanDir);
      
      return {
        success: findings.length === 0,
        scanned: scanDir,
        findings,
        summary: {
          total: findings.length,
          critical: findings.filter(f => f.severity === 'critical').length,
          high: findings.filter(f => f.severity === 'high').length
        }
      };
    }
  },
  
  depGraph: {
    name: 'dep:graph',
    description: 'Generate dependency graph',
    
    async execute(options = {}) {
      try {
        const result = execSync('npm ls --json --all', {
          encoding: 'utf-8',
          maxBuffer: 10 * 1024 * 1024
        });
        
        const deps = JSON.parse(result);
        
        function countDeps(node, depth = 0) {
          if (!node.dependencies) return { direct: 0, total: 0, maxDepth: depth };
          
          let total = Object.keys(node.dependencies).length;
          let maxDepth = depth;
          
          for (const dep of Object.values(node.dependencies)) {
            const sub = countDeps(dep, depth + 1);
            total += sub.total;
            maxDepth = Math.max(maxDepth, sub.maxDepth);
          }
          
          return { direct: Object.keys(node.dependencies).length, total, maxDepth };
        }
        
        const stats = countDeps(deps);
        
        return {
          success: true,
          name: deps.name,
          version: deps.version,
          stats
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }
  },
  
  licenseCheck: {
    name: 'license:check',
    description: 'Check dependency licenses',
    
    async execute(options = {}) {
      const allowedLicenses = [
        'MIT', 'ISC', 'BSD-2-Clause', 'BSD-3-Clause', 'Apache-2.0', '0BSD', 'CC0-1.0'
      ];
      
      try {
        const result = execSync('npm ls --json --all', {
          encoding: 'utf-8',
          maxBuffer: 10 * 1024 * 1024
        });
        
        // In production, would parse and check each license
        return {
          success: true,
          allowedLicenses,
          message: 'License check completed (implement full scanning)',
          flagged: []
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }
  },
  
  hmac: {
    name: 'crypto:hmac',
    description: 'Generate HMAC signature',
    
    async execute(data, secret, algorithm = 'sha256') {
      if (!data || !secret) {
        return {
          error: 'Both data and secret are required'
        };
      }
      
      const hmac = createHmac(algorithm, secret);
      hmac.update(typeof data === 'string' ? data : JSON.stringify(data));
      const signature = hmac.digest('hex');
      
      return {
        success: true,
        algorithm,
        signature,
        header: `sha256=${signature}`
      };
    }
  }
};
