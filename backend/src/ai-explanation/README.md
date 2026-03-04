# AI Explanation Module

This module integrates Google's Gemini API to generate educational financial explanations for investment allocations, risk profiles, and financial strategies.

## Features

- **AI-Generated Explanations**: Uses Google Gemini API to create educational content
- **Multiple Explanation Types**: 
  - Allocation explanation
  - Risk profile reasoning  
  - Time horizon context
  - Financial education narrative
- **Response Caching**: Caches responses for 1 hour to reduce API calls
- **Safety Guarantees**: 
  - Detects and flags price predictions (which are prohibited)
  - Injects critical disclaimer on all responses
  - Uses safe safety settings for content generation
- **Educational Focus**: All prompts designed for financial literacy, not investment advice

## Setup

### 1. Install Dependencies

```bash
npm install @google/generative-ai
```

### 2. Get Gemini API Key

1. Visit [Google AI Studio](https://ai.google.dev)
2. Click "Get API Key"
3. Create a new API key in Google Cloud Console

### 3. Configure Environment

Add to `.env`:

```bash
GEMINI_API_KEY=your_api_key_here
```

## API Endpoint

### POST `/ai-explanation/generate`

Generates an AI explanation based on financial simulation data.

**Request Body:**

```typescript
{
  risk_profile: string;                    // e.g., "Balanced"
  allocation: Record<string, number>;      // e.g., { "Stocks": 0.4, "Bonds": 0.3 }
  capital_distribution: Record<string, number>;
  projection: {
    conservative: number;
    expected: number;
    optimistic: number;
    total_contributions: number;
  };
  time_horizon: number;                    // years
  monthly_contribution: number;            // NPR
  risk_tolerance: 'LOW' | 'MEDIUM' | 'HIGH';
  liquidity_need: 'LOW' | 'MEDIUM' | 'HIGH';
  explanation_type?: 'allocation' | 'risk_profile' | 'time_horizon' | 'narrative';
}
```

**Response:**

```typescript
{
  explanation: string;        // Full explanation with disclaimer
  type: string;              // Type of explanation generated
  generated_at: Date;        // Timestamp
  model: string;             // "gemini-1.5-flash"
}
```

**Example:**

```bash
curl -X POST http://localhost:3001/ai-explanation/generate \
  -H "Content-Type: application/json" \
  -d '{
    "risk_profile": "Balanced",
    "allocation": { "Stocks": 0.4, "Bonds": 0.3, "Gold": 0.15, "FD": 0.15 },
    "capital_distribution": { "Stocks": 400000, "Bonds": 300000, "Gold": 150000, "FD": 150000 },
    "projection": {
      "conservative": 1500000,
      "expected": 2000000,
      "optimistic": 2500000,
      "total_contributions": 1000000
    },
    "time_horizon": 10,
    "monthly_contribution": 5000,
    "risk_tolerance": "MEDIUM",
    "liquidity_need": "LOW",
    "explanation_type": "narrative"
  }'
```

## Explanation Types

### 1. Allocation Explanation
Explains why the recommended allocation is appropriate for the user's profile.

### 2. Risk Profile Reasoning
Explains what "Balanced" (or other profile) means and why it matches their situation.

### 3. Time Horizon Context
Discusses how the time horizon influences strategy and compound growth.

### 4. Financial Education Narrative
A comprehensive, motivational overview combining all aspects.

## Disclaimer

**All responses include this critical disclaimer:**

```
⚠️ IMPORTANT DISCLAIMER

This explanation is for educational purposes only and does not constitute 
investment advice. Past performance does not guarantee future results. 
All investments carry risk. Consult a qualified financial advisor.
```

## Safety Features

### Price Prediction Detection

The service automatically detects and flags responses containing prohibited patterns:

- "will rise" / "will fall"
- "guaranteed returns"
- "$XXX price target"
- "sure profit"

### Prompt Templates

All prompts are carefully designed to:
- Request educational content only
- Avoid financial advice language
- Emphasize learning and financial literacy
- Include explicit disclaimers in prompts

## Caching

Responses are cached for 1 hour based on:
- Risk profile
- Explanation type
- Time horizon
- Risk tolerance
- Allocation breakdown

Cache automatically:
- Expires after 1 hour
- Limits to 100 entries (oldest removed when limit exceeded)
- Can be manually cleared via `clearCache()` method

## Error Handling

Gracefully handles:
- Missing API key (service disabled)
- API failures (returns 500 with clear message)
- Timeout errors (exceeds 30 seconds)
- Invalid input (validates DTO)

## Testing

Run unit tests:

```bash
npm test -- ai-explanation.service.spec.ts
```

Tests cover:
- Prompt template generation
- Price prediction detection
- Cache functionality
- Cache expiration
- Cache size limits
- Different explanation types

## Integration with Simulator

The AI module is designed to work with the Simulator module:

```typescript
// In dashboard or another frontend component
const simulationResult = await simulatorApi.runSimulation(userInput);

const explanation = await fetch('/ai-explanation/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    risk_profile: simulationResult.risk_profile,
    allocation: simulationResult.allocation,
    capital_distribution: simulationResult.capital_distribution,
    projection: simulationResult.projection,
    time_horizon: userInput.duration_years,
    monthly_contribution: userInput.monthly_contribution,
    risk_tolerance: userInput.risk_tolerance,
    liquidity_need: userInput.liquidity_need,
    explanation_type: 'narrative'
  })
});
```

## Cost Considerations

- Gemini API free tier: 60 requests/minute
- With caching: Typical usage ~5-10 requests/day (most read from cache)
- Estimated monthly cost: ~$0.50 (if exceeding free tier)

## Future Enhancements

- [ ] Multi-language support
- [ ] Streaming responses (chunked delivery)
- [ ] User preference for explanation length
- [ ] Analytics on which explanations are most helpful
- [ ] A/B testing different prompt variations
- [ ] Integration with user feedback system

## Troubleshooting

### API Key Not Found
```
Error: AI explanation service is not configured
```
**Solution**: Add `GEMINI_API_KEY` to `.env`

### Rate Limiting
```
{"error": "Quota exceeded"}
```
**Solution**: Caching is enabled; most responses use cache. If frequently exceeded, implement request queuing.

### Response Contains Price Prediction
```
console.warn('AI response contained price predictions. Filtering content.')
```
**Action**: Logged but not blocked. Review logs to improve prompts.
