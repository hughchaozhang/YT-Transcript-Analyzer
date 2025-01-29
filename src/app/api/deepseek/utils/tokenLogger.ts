import fs from 'fs';
import path from 'path';

interface TokenUsage {
  timestamp: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  endpoint: string;
}

// DeepSeek pricing per 1M tokens
const PRICING = {
  INPUT: 0.07,   // $0.07 per 1M input tokens
  OUTPUT: 1.1,   // $1.1 per 1M output tokens
};

export function logTokenUsage(usage: TokenUsage) {
  // Only log in development
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const logPath = path.join(process.cwd(), 'token-usage.md');
  const timestamp = new Date().toISOString();
  
  // Calculate costs
  const inputCost = (usage.inputTokens / 1_000_000) * PRICING.INPUT;
  const outputCost = (usage.outputTokens / 1_000_000) * PRICING.OUTPUT;
  const totalCost = inputCost + outputCost;
  
  const logEntry = `
## API Call at ${timestamp}
- **Endpoint**: ${usage.endpoint}
- **Input Tokens**: ${usage.inputTokens.toLocaleString()} ($${inputCost.toFixed(4)})
- **Output Tokens**: ${usage.outputTokens.toLocaleString()} ($${outputCost.toFixed(4)})
- **Total Tokens**: ${usage.totalTokens.toLocaleString()}
- **Total Cost**: $${totalCost.toFixed(4)}

`;

  // Create file if it doesn't exist
  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, `# DeepSeek API Token Usage Log

## Pricing
- Input: $${PRICING.INPUT} per 1M tokens
- Output: $${PRICING.OUTPUT} per 1M tokens

`);
  }

  // Append the new entry
  fs.appendFileSync(logPath, logEntry);
} 