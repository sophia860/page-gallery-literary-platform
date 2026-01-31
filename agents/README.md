# Page Gallery Agent System

AI-powered development agents for maintaining and evolving the Page Gallery literary submission platform.

## Quick Start

```bash
# Install dependencies
cd agents
npm install

# List available agents
npm run agent list

# Run an agent with a task
npm run agent run frontend --task "Fix mobile layout on submission page"

# Get detailed info about an agent
npm run agent info security

# Validate prompts file
npm run agent validate
```

## Architecture

```
agents/
├── agent-runner.js    # CLI entry point
├── registry.js        # Loads prompts, pairs with tools
├── tools/             # Tool implementations
│   ├── index.js       # Tool loader
│   ├── repo.js        # File read/write
│   ├── npm.js         # Package management
│   ├── http.js        # HTTP client
│   ├── db.js          # Database operations
│   ├── test.js        # Testing utilities
│   ├── security.js    # Security scanning
│   ├── performance.js # Perf profiling
│   └── submissions.js # Submission access (READ-ONLY)
├── utils/
│   └── logger.js      # Structured logging
└── README.md
```

## Available Agents

| # | Agent | Domain |
|---|-------|--------|
| 1 | Frontend/UI | HTML, CSS, client-side JS, Cardo typography |
| 2 | Backend API | Express.js, REST, authentication, HMAC |
| 3 | Database/Schema | SQLite, migrations, data integrity |
| 4 | UX | User flows, interaction patterns |
| 5 | Accessibility | WCAG compliance, screen readers, keyboard nav |
| 6 | Typo/Copy | UI text, error messages (NOT submissions) |
| 7 | Security Audit | Vulnerabilities, headers, secrets |
| 8 | Performance | Load times, bundles, profiling |
| 9 | SEO | Meta tags, structured data, sitemaps |
| 10 | Testing/QA | Unit, integration, E2E tests |
| 11 | Documentation | README, API docs, JSDoc |
| 12 | Dependency | Package updates, licenses |
| 13 | Backup/Recovery | Database backups, disaster recovery |
| 14 | Monitoring | Health checks, uptime, alerting |
| 15 | CI/CD | GitHub Actions, deployments |
| 16 | Logging | Structured logs, request tracking |
| 17 | Submission Review | Editor assistance (READ-ONLY) |

## Execution Policies

### Critical Constraints

1. **No AI Text to Writers** - Agents never generate creative writing or content presented to writers as human-written
2. **Editor/Writer Separation** - Strict boundary between editor and writer tools
3. **Cardo Typography** - UI outputs specify Cardo for literary content
4. **Grounded Responses** - Agents refuse tasks requiring information they don't have
5. **Secret Protection** - Never log, expose, or commit secrets

### Logging

- All invocations logged with request IDs
- Agent outputs stored separately from user content
- Automatic secret redaction
- Logs stored in `./logs/agent-invocations.jsonl`

## Integration Example

```javascript
import registry from './registry.js';
import { loadTools } from './tools/index.js';

const agent = registry.getAgent('frontend');
const tools = await loadTools(agent.tools);

// Use with your LLM provider
const response = await llm.complete({
  system: agent.systemPrompt,
  user: 'Fix the mobile navigation menu',
  tools: tools
});
```

## Environment Variables

```bash
DB_PATH=./data/pagegallery.db
BACKUP_DIR=./backups
LOG_DIR=./logs
API_URL=http://localhost:5000
DEBUG=true  # Enable debug logging
```

## License

MIT - See project root LICENSE file
