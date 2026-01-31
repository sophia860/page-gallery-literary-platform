#!/usr/bin/env node

/**
 * Page Gallery Agent Runner
 * CLI tool for invoking AI agents with specific tasks
 */

import { program } from 'commander';
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';
import registry from './registry.js';
import { loadTools } from './tools/index.js';
import { Logger } from './utils/logger.js';

const logger = new Logger();

// ASCII banner
const banner = `
${chalk.cyan('╔════════════════════════════════════════════╗')}
${chalk.cyan('║')}  ${chalk.bold.white('Page Gallery Agent Runner')}               ${chalk.cyan('║')}
${chalk.cyan('║')}  ${chalk.gray('AI-powered development assistance')}        ${chalk.cyan('║')}
${chalk.cyan('╚════════════════════════════════════════════╝')}
`;

program
  .name('pg-agent')
  .description('Invoke AI agents for Page Gallery development tasks')
  .version('1.0.0');

// List available agents
program
  .command('list')
  .description('List all available agents')
  .action(() => {
    console.log(banner);
    console.log(chalk.bold('\nAvailable Agents:\n'));
    
    const agents = registry.listAgents();
    agents.forEach(agent => {
      console.log(
        chalk.yellow(`  ${agent.number.toString().padStart(2)}.`) +
        chalk.white(` ${agent.title.padEnd(30)}`) +
        chalk.gray(agent.domain.substring(0, 40))
      );
    });
    
    console.log(chalk.gray('\nUse: pg-agent run <agent> --task "<description>"'));
  });

// Run an agent
program
  .command('run <agent>')
  .description('Run an agent with a specific task')
  .option('-t, --task <task>', 'Task description for the agent')
  .option('-f, --files <files...>', 'Specific files to focus on')
  .option('-d, --dry-run', 'Show what would be done without executing')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (agentName, options) => {
    const requestId = `req_${uuidv4().slice(0, 8)}`;
    
    console.log(banner);
    logger.info(`Request ID: ${requestId}`);
    
    // Resolve agent
    const agent = registry.getAgent(agentName);
    if (!agent) {
      logger.error(`Unknown agent: ${agentName}`);
      console.log(chalk.yellow('\nAvailable agents:'));
      registry.listAgents().forEach(a => {
        console.log(chalk.gray(`  - ${a.title} (${a.key})`));
      });
      process.exit(1);
    }
    
    logger.info(`Agent: ${agent.title}`);
    logger.info(`Domain: ${agent.domain}`);
    
    if (!options.task) {
      logger.error('No task specified. Use --task "<description>"');
      process.exit(1);
    }
    
    logger.info(`Task: ${options.task}`);
    
    // Load tools for this agent
    const tools = await loadTools(agent.tools);
    logger.info(`Tools loaded: ${agent.tools.join(', ')}`);
    
    if (options.dryRun) {
      console.log(chalk.yellow('\n[DRY RUN] Would execute with:'));
      console.log(chalk.gray('  System Prompt:'), agent.systemPrompt.substring(0, 100) + '...');
      console.log(chalk.gray('  Tools:'), agent.tools);
      console.log(chalk.gray('  Files:'), options.files || 'all');
      return;
    }
    
    // Build execution context
    const context = {
      requestId,
      agent: agent.key,
      task: options.task,
      files: options.files || [],
      systemPrompt: agent.systemPrompt,
      tools,
      verbose: options.verbose
    };
    
    console.log(chalk.cyan('\n─────────────────────────────────────────────'));
    console.log(chalk.bold('Execution Context:'));
    console.log(chalk.gray(JSON.stringify({
      requestId: context.requestId,
      agent: context.agent,
      task: context.task,
      toolCount: Object.keys(tools).length
    }, null, 2)));
    console.log(chalk.cyan('─────────────────────────────────────────────\n'));
    
    // Log the invocation
    logger.logInvocation(context);
    
    console.log(chalk.green('✓ Agent context prepared'));
    console.log(chalk.gray('\nTo execute, integrate with your LLM provider:'));
    console.log(chalk.white(`
  const response = await llm.complete({
    system: context.systemPrompt,
    user: context.task,
    tools: context.tools
  });
`));
  });

// Show agent details
program
  .command('info <agent>')
  .description('Show detailed information about an agent')
  .action((agentName) => {
    console.log(banner);
    
    const agent = registry.getAgent(agentName);
    if (!agent) {
      logger.error(`Unknown agent: ${agentName}`);
      process.exit(1);
    }
    
    console.log(chalk.bold(`\n${agent.title}\n`));
    console.log(chalk.yellow('Domain:'), agent.domain);
    console.log(chalk.yellow('\nTools:'));
    agent.tools.forEach(tool => {
      console.log(chalk.gray(`  • ${tool}`));
    });
    console.log(chalk.yellow('\nSystem Prompt:'));
    console.log(chalk.gray(agent.systemPrompt));
  });

// Validate prompts file
program
  .command('validate')
  .description('Validate AI_AGENT_PROMPTS.md structure')
  .action(() => {
    console.log(banner);
    console.log(chalk.bold('Validating AI_AGENT_PROMPTS.md...\n'));
    
    const agents = registry.listAgents();
    let valid = true;
    
    agents.forEach(agent => {
      const hasPrompt = registry.getAgent(agent.key)?.systemPrompt;
      const hasTools = agent.tools.length > 0;
      
      const status = hasPrompt && hasTools ? chalk.green('✓') : chalk.red('✗');
      console.log(`  ${status} ${agent.title}`);
      
      if (!hasPrompt) {
        console.log(chalk.red(`      Missing system prompt`));
        valid = false;
      }
      if (!hasTools) {
        console.log(chalk.red(`      Missing tool definitions`));
        valid = false;
      }
    });
    
    console.log();
    if (valid) {
      console.log(chalk.green('✓ All agents validated successfully'));
    } else {
      console.log(chalk.red('✗ Validation failed'));
      process.exit(1);
    }
  });

program.parse();
