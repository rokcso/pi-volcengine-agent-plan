# pi-volcengine-agent-plan

A [pi](https://github.com/earendil-works/pi-coding-agent) extension that registers **Volcengine Ark Agent Plan** as a custom OpenAI-compatible provider, with **verified thinking-depth support** for domestic coding models (Doubao, DeepSeek, GLM, Kimi, MiniMax).

## Why this extension

There are already two pi extensions for Volcengine Ark on GitHub — but both target the older **Coding Plan** subscription:

- They use the `/api/coding/v3` endpoint.
- An **Agent Plan** API key gets HTTP 401 against that endpoint (the two plans have independent resource pools and keys).
- Both mark every model `reasoning: false`, so pi's thinking-depth control never appears.

This extension fixes all three:

| | Coding Plan extensions | This extension |
|---|---|---|
| Endpoint | `/api/coding/v3` | `/api/plan/v3` (Agent Plan) |
| Thinking depth | Not configured | Verified working, all 6 levels |
| Runtime import | `@mariozechner/pi-coding-agent` (may not exist) | `@earendil-works/pi-coding-agent` |

## Install

```bash
# from npm (after publish)
pi install npm:pi-volcengine-agent-plan

# from git
pi install git:github.com/rokcso/pi-volcengine-agent-plan

# from a local checkout
pi install /path/to/pi-volcengine-agent-plan
```

## Configure

Set your Agent Plan API key as an environment variable:

```bash
export ARK_API_KEY=ark-xxxxxxxxxxxxxxxx
```

Add it to your shell profile (`~/.zshrc`, `~/.bashrc`) for persistence.

Then set the provider as default in `~/.pi/agent/settings.json`:

```json
{
  "defaultProvider": "volcengine-agent-plan",
  "defaultModel": "doubao-seed-2.0-pro",
  "defaultThinkingLevel": "medium"
}
```

Or switch at runtime with `/model volcengine-agent-plan/doubao-seed-2.0-pro`.

## Models

| Model | Reasoning | Context | Max tokens |
|---|:---:|---:|---:|
| ark-code-latest | ✅ | 256K | 16384 |
| deepseek-v4-pro | ✅ | 128K | 16384 |
| deepseek-v4-flash | — | 128K | 16384 |
| kimi-k2.7-code | ✅ | 256K | 16384 |
| kimi-k2.6 | — | 256K | 16384 |
| doubao-seed-2.0-pro | ✅ | 128K | 16384 |
| doubao-seed-2.0-code | ✅ | 128K | 16384 |
| doubao-seed-2.0-lite | — | 128K | 8192 |
| doubao-seed-code | ✅ | 128K | 8192 |
| glm-5.2 | ✅ | 128K | 8192 |
| minimax-m2.7 | — | 128K | 8192 |
| minimax-m3 | — | 128K | 8192 |

Costs are zero because Agent Plan is a flat-rate subscription (billed via AFP points, not per-token).

## Thinking depth

Models marked ✅ support six thinking levels, cycled with **Shift+Tab**:

`off` → `minimal` → `low` → `medium` → `high` → `xhigh`

pi's built-in `deepseek` thinkingFormat sends `thinking: { type }` plus `reasoning_effort`. Volcengine's `reasoning_effort` tops out at `high`, so `xhigh` is downgraded to `high` via `thinkingLevelMap`.

### Verified measurements

All six levels return HTTP 200 on the Agent Plan endpoint. Measured `reasoning_tokens` on `doubao-seed-2.0-pro`:

| Level | Payload sent | reasoning_tokens |
|---|---|---:|
| off | `thinking:{type:disabled}` | 0 |
| minimal | `thinking:{type:enabled}` + `reasoning_effort:minimal` | 0 |
| low | `thinking:{type:enabled}` + `reasoning_effort:low` | 244 |
| medium | `thinking:{type:enabled}` + `reasoning_effort:medium` | 302 |
| xhigh→high | `thinking:{type:enabled}` + `reasoning_effort:high` | 358 |

`doubao-seed-2.0-pro` shows the cleanest effort gradient. `glm-5.2` supports on/off but its effort steps are less strictly monotonic on simple prompts.

## Develop

```bash
git clone https://github.com/rokcso/pi-volcengine-agent-plan
cd pi-volcengine-agent-plan
npm install                      # installs peer types for IDE checking
npx tsc --noEmit                 # type-check
```

Extensions run via [jiti](https://github.com/unjs/jiti), so TypeScript works without a build step. Edit `extensions/index.ts` and `/reload` in pi.

The model catalogue lives in the `MODELS` array in `extensions/index.ts` — add new Volcengine models there as they ship.

## License

MIT
