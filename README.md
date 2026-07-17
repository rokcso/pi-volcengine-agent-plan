# pi-volcengine-agent-plan

A [pi](https://github.com/earendil-works/pi-coding-agent) extension for **Volcengine Ark Agent Plan** — domestic coding models (Doubao, DeepSeek, GLM, Kimi, MiniMax) with **verified 6-level thinking-depth control**.

> Other Volcengine pi extensions target the old **Coding Plan** endpoint (`/api/coding/v3`) and get HTTP 401 with an Agent Plan key. Agent Plan has its own endpoint and resource pool — this extension is built for it.

## Install

```bash
pi install git:github.com/rokcso/pi-volcengine-agent-plan
```

After installing, authenticate with your Agent Plan API key:

1. Run `/login` in pi
2. Select **volcengine-agent-plan**
3. Paste your Agent Plan API key

Then switch models with `/model volcengine-agent-plan/<model-id>`. See the [official Agent Plan docs](https://www.volcengine.com/docs/82379/2522860) for available model IDs. Reasoning models support 6 thinking levels cycled with **Shift+Tab**.

> Optionally set a default in `~/.pi/agent/settings.json`:
> ```json
> { "defaultProvider": "volcengine-agent-plan", "defaultModel": "doubao-seed-2.0-pro", "defaultThinkingLevel": "medium" }
> ```

## Develop

```bash
git clone https://github.com/rokcso/pi-volcengine-agent-plan
cd pi-volcengine-agent-plan
npm install          # peer types for IDE checking
npx tsc --noEmit     # type-check
pi install .         # install from your local checkout
```

Extensions run via [jiti](https://github.com/unjs/jiti) — edit `extensions/index.ts` and `/reload` in pi. No build step. Model definitions live in the `MODELS` array, aligned with the [official Agent Plan model table](https://www.volcengine.com/docs/82379/2522860).

### 2026-07 updates

- **Responses API**: switched from `api: "openai-completions"` to `api: "openai-responses"`
- **New models**:
  - **doubao-seed-evolving** — 1024k context / 256k output, reasoning + vision
  - **kimi-k3** — 1024k context / 128k output, reasoning + vision, 2.8T parameters (Medium+ plan only)
- **kimi-k3 vision**: confirmed to support image input (native vision understanding)

## Acknowledgments

Model catalogue and provider structure informed by two prior Coding Plan extensions:

- [kaichen/pi-volcengine-provider](https://github.com/kaichen/pi-volcengine-provider)
- [OptimisticQuan/pi-volcengine-coding-plan](https://github.com/OptimisticQuan/pi-volcengine-coding-plan)

## License

MIT
