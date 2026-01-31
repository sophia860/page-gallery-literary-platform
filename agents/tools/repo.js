/**
 * Repository Tools
 * File read/write operations for the codebase
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

export const repoTools = {
  read: {
    name: 'repo:read',
    description: 'Read file contents or list directory',
    
    async execute(path, options = {}) {
      const fullPath = join(process.cwd(), path);
      
      if (!existsSync(fullPath)) {
        return { error: `Path not found: ${path}` };
      }
      
      const stats = statSync(fullPath);
      
      if (stats.isDirectory()) {
        const entries = readdirSync(fullPath, { withFileTypes: true });
        return {
          type: 'directory',
          path,
          entries: entries.map(e => ({
            name: e.name,
            type: e.isDirectory() ? 'directory' : 'file'
          }))
        };
      }
      
      const content = readFileSync(fullPath, 'utf-8');
      return {
        type: 'file',
        path,
        content,
        size: stats.size,
        modified: stats.mtime
      };
    }
  },
  
  write: {
    name: 'repo:write',
    description: 'Write content to a file',
    
    async execute(path, content, options = {}) {
      const fullPath = join(process.cwd(), path);
      
      // Safety checks
      if (path.includes('..')) {
        return { error: 'Path traversal not allowed' };
      }
      
      // Don't allow writing to sensitive files
      const forbidden = ['.env', '.git', 'node_modules'];
      if (forbidden.some(f => path.includes(f))) {
        return { error: `Cannot write to protected path: ${path}` };
      }
      
      const existed = existsSync(fullPath);
      
      if (options.dryRun) {
        return {
          dryRun: true,
          path,
          wouldCreate: !existed,
          contentLength: content.length
        };
      }
      
      writeFileSync(fullPath, content, 'utf-8');
      
      return {
        success: true,
        path,
        created: !existed,
        size: content.length
      };
    }
  }
};
