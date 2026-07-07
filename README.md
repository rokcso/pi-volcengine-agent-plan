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

After installing, run `/login` in pi and select the **volcengine-agent-plan** provider to store your Agent Plan API key:

```
/login
```

The key is persisted in `~/.pi/agent/auth.json` (with `0600` permissions). It takes priority over the `ARK_API_KEY` environment variable, which also works as a fallback if you prefer not to use `/login`.

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
| doubao-seed-2.0-mini | — | 256K | 128K |
| doubao-seed-2.0-lite | — | 256K | 128K |
| deepseek-v4-flash † | — | 1024K | 384K |
| doubao-seed-2.0-code | ✅ | 256K | 128K |
| doubao-seed-2.0-pro | ✅ | 256K | 128K |
| minimax-m2.7 | — | 200K | 128K |
| minimax-m3 | — | 512K | 128K |
| glm-5.2 | ✅ | 1024K | 128K |
| kimi-k2.6 | — | 256K | 32K |
| kimi-k2.7-code | ✅ | 256K | 32K |
| deepseek-v4-pro † | ✅ | 1024K | 384K |

† DeepSeek models are early-access (尝鲜体验版). If you encounter rate limits or
  congestion, switch to another model.

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

The model catalogue lives in the `MODELS` array in `extensions/index.ts`. Models and parameters are aligned with the [official Agent Plan model table](https://www.volcengine.com/docs/82379/2522860).

### Adding a new model

1. Add an entry to the `MODELS` array in `extensions/index.ts`
2. Add a row to the table above in this README
3. Run `/reload` in pi

## Acknowledgments

This extension builds on prior Volcengine Ark pi extensions. Both target the
older Coding Plan endpoint, but their model catalogue and provider structure
were valuable references:

- [kaichen/pi-volcengine-provider](https://github.com/kaichen/pi-volcengine-provider) — Coding Plan provider with custom streaming
- [OptimisticQuan/pi-volcengine-coding-plan](https://github.com/OptimisticQuan/pi-volcengine-coding-plan) — Coding Plan, config-driven model catalogue (the pattern this extension follows)

The Agent Plan endpoint, thinking-depth configuration, and API-key handling
were verified independently against the live `/api/plan/v3` API.

## License

MIT
