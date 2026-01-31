/**
 * Agent Registry
 * Loads agent prompts from AI_AGENT_PROMPTS.md and pairs them with toolsets
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Tool definitions for each agent
const AGENT_TOOLS = {
  frontend: ['repo:read', 'repo:write', 'npm:lint', 'npm:build', 'playwright:run'],
  backend: ['repo:read', 'repo:write', 'http:client', 'npm:test', 'crypto:hmac'],
  database: ['repo:read', 'repo:write', 'db:migrate', 'db:query', 'db:backup'],
  ux: ['repo:read', 'repo:write', 'playwright:run', 'analytics:read'],
  accessibility: ['repo:read', 'repo:write', 'axe:audit', 'playwright:a11y'],
  typo: ['repo:read', 'repo:write', 'spellcheck:run'],
  security: ['npm:audit', 'repo:read', 'http:headers', 'secret:scan', 'dep:graph'],
  performance: ['repo:read', 'repo:write', 'lighthouse:run', 'profiler:cpu', 'profiler:memory'],
  seo: ['repo:read', 'repo:write', 'seo:validate', 'sitemap:generate'],
  testing: ['repo:read', 'repo:write', 'npm:test', 'coverage:report', 'playwright:e2e'],
  documentation: ['repo:read', 'repo:write', 'markdown:lint', 'jsdoc:generate'],
  dependency: ['npm:outdated', 'npm:update', 'npm:test', 'license:check', 'bundlesize:check'],
  backup: ['db:backup', 'db:restore', 'backup:verify', 'storage:sync'],
  monitoring: ['http:client', 'metrics:read', 'alerts:configure', 'logs:tail'],
  cicd: ['repo:read', 'repo:write', 'actions:validate', 'env:check', 'deploy:dryrun'],
  logging: ['repo:read', 'repo:write', 'logs:tail', 'logs:search'],
  'submission-review': ['submissions:read', 'vector:search', 'status:update']
};

// Agent name aliases
const AGENT_ALIASES = {
  'frontend': ['frontend', 'ui', 'frontend-ui', '1'],
  'backend': ['backend', 'api', 'backend-api', '2'],
  'database': ['database', 'db', 'schema', '3'],
  'ux': ['ux', 'user-experience', '4'],
  'accessibility': ['accessibility', 'a11y', '5'],
  'typo': ['typo', 'copy', 'typo-copy', '6'],
  'security': ['security', 'security-audit', '7'],
  'performance': ['performance', 'perf', '8'],
  'seo': ['seo', '9'],
  'testing': ['testing', 'qa', 'test', '10'],
  'documentation': ['documentation', 'docs', '11'],
  'dependency': ['dependency', 'deps', '12'],
  'backup': ['backup', 'recovery', '13'],
  'monitoring': ['monitoring', 'monitor', '14'],
  'cicd': ['cicd', 'ci', 'cd', 'ci-cd', '15'],
  'logging': ['logging', 'logs', '16'],
  'submission-review': ['submission-review', 'review', 'submissions', '17']
};

/**
 * Parse AI_AGENT_PROMPTS.md and extract agent sections
 */
function parseAgentPrompts() {
  const promptsPath = join(__dirname, '..', 'AI_AGENT_PROMPTS.md');
  const content = readFileSync(promptsPath, 'utf-8');
  
  const agents = {};
  const sectionRegex = /## (\d+)\. ([^\n]+)\n([\s\S]*?)(?=## \d+\.|## Execution Policies|$)/g;
  
  let match;
  while ((match = sectionRegex.exec(content)) !== null) {
    const [, number, title, body] = match;
    const agentKey = title.toLowerCase()
      .replace(/\//g, '-')
      .replace(/\s+agent$/i, '')
      .replace(/\s+/g, '-');
    
    // Extract system prompt from code block
    const promptMatch = body.match(/```\n([\s\S]*?)```/);
    const systemPrompt = promptMatch ? promptMatch[1].trim() : '';
    
    // Extract domain
    const domainMatch = body.match(/\*\*Domain:\*\*\s*([^\n]+)/);
    const domain = domainMatch ? domainMatch[1].trim() : '';
    
    agents[agentKey] = {
      number: parseInt(number),
      title: title.trim(),
      domain,
      systemPrompt,
      rawSection: body.trim()
    };
  }
  
  return agents;
}

/**
 * Resolve agent alias to canonical name
 */
function resolveAgentName(alias) {
  const normalized = alias.toLowerCase().trim();
  
  for (const [canonical, aliases] of Object.entries(AGENT_ALIASES)) {
    if (aliases.includes(normalized)) {
      return canonical;
    }
  }
  
  return null;
}

/**
 * Agent Registry class
 */
export class AgentRegistry {
  constructor() {
    this.agents = parseAgentPrompts();
    this.tools = AGENT_TOOLS;
  }
  
  /**
   * Get agent by name or alias
   */
  getAgent(nameOrAlias) {
    const canonical = resolveAgentName(nameOrAlias);
    if (!canonical) {
      return null;
    }
    
    // Find matching agent
    for (const [key, agent] of Object.entries(this.agents)) {
      if (key.includes(canonical) || canonical.includes(key.split('-')[0])) {
        return {
          ...agent,
          key,
          tools: this.tools[canonical] || this.tools[key.split('-')[0]] || []
        };
      }
    }
    
    return null;
  }
  
  /**
   * List all available agents
   */
  listAgents() {
    return Object.entries(this.agents).map(([key, agent]) => ({
      key,
      number: agent.number,
      title: agent.title,
      domain: agent.domain,
      tools: this.tools[key.split('-')[0]] || []
    }));
  }
  
  /**
   * Get tools for an agent
   */
  getTools(agentName) {
    const canonical = resolveAgentName(agentName);
    return canonical ? (this.tools[canonical] || []) : [];
  }
}

export default new AgentRegistry();
