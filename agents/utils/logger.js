/**
 * Agent Logger
 * Structured logging with request ID tracking and secret redaction
 */

import { appendFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const LOG_DIR = process.env.LOG_DIR || './logs';
const LOG_FILE = join(LOG_DIR, 'agent-invocations.jsonl');

// Patterns to redact from logs
const REDACT_PATTERNS = [
  /password["']?\s*[:=]\s*["'][^"']+["']/gi,
  /api[_-]?key["']?\s*[:=]\s*["'][^"']+["']/gi,
  /secret["']?\s*[:=]\s*["'][^"']+["']/gi,
  /token["']?\s*[:=]\s*["'][^"']+["']/gi,
  /bearer\s+[a-zA-Z0-9\-_.]+/gi,
  /ghp_[a-zA-Z0-9]{36}/g,
  /sk-[a-zA-Z0-9]{48}/g
];

function redact(text) {
  if (typeof text !== 'string') {
    text = JSON.stringify(text);
  }
  
  let redacted = text;
  for (const pattern of REDACT_PATTERNS) {
    redacted = redacted.replace(pattern, '[REDACTED]');
  }
  return redacted;
}

export class Logger {
  constructor(options = {}) {
    this.logToFile = options.logToFile !== false;
    this.logToConsole = options.logToConsole !== false;
    
    // Ensure log directory exists
    if (this.logToFile && !existsSync(LOG_DIR)) {
      try {
        mkdirSync(LOG_DIR, { recursive: true });
      } catch (e) {
        this.logToFile = false;
      }
    }
  }
  
  _format(level, message, meta = {}) {
    return {
      timestamp: new Date().toISOString(),
      level,
      message: redact(message),
      ...meta
    };
  }
  
  _write(entry) {
    const line = JSON.stringify(entry);
    
    if (this.logToConsole) {
      const colors = {
        error: '\x1b[31m',
        warn: '\x1b[33m',
        info: '\x1b[36m',
        debug: '\x1b[90m'
      };
      const reset = '\x1b[0m';
      const color = colors[entry.level] || '';
      console.log(`${color}[${entry.level.toUpperCase()}]${reset} ${entry.message}`);
    }
    
    if (this.logToFile) {
      try {
        appendFileSync(LOG_FILE, line + '\n');
      } catch (e) {
        // Silently fail file logging
      }
    }
  }
  
  info(message, meta) {
    this._write(this._format('info', message, meta));
  }
  
  warn(message, meta) {
    this._write(this._format('warn', message, meta));
  }
  
  error(message, meta) {
    this._write(this._format('error', message, meta));
  }
  
  debug(message, meta) {
    if (process.env.DEBUG) {
      this._write(this._format('debug', message, meta));
    }
  }
  
  /**
   * Log an agent invocation with full context
   */
  logInvocation(context) {
    const entry = {
      timestamp: new Date().toISOString(),
      type: 'agent_invocation',
      requestId: context.requestId,
      agent: context.agent,
      task: redact(context.task),
      files: context.files,
      toolCount: Object.keys(context.tools || {}).length
    };
    
    if (this.logToFile) {
      try {
        appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n');
      } catch (e) {
        // Silently fail
      }
    }
    
    return entry;
  }
  
  /**
   * Log an agent response/decision
   */
  logDecision(requestId, decision, rationale) {
    const entry = {
      timestamp: new Date().toISOString(),
      type: 'agent_decision',
      requestId,
      decision: redact(decision),
      rationale: redact(rationale)
    };
    
    if (this.logToFile) {
      try {
        appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n');
      } catch (e) {
        // Silently fail
      }
    }
    
    return entry;
  }
}

export default new Logger();
