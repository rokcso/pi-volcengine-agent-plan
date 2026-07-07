# pi-volcengine-agent-plan

A [pi](https://github.com/earendil-works/pi-coding-agent) extension for **Volcengine Ark Agent Plan** — supports domestic coding models (Doubao, DeepSeek, GLM, Kimi, MiniMax) with **verified 6-level thinking-depth control**.

> If you've tried other Volcengine pi extensions and got HTTP 401, that's because they target the old **Coding Plan** endpoint (`/api/coding/v3`). Agent Plan uses its own endpoint and resource pool — this extension is built for it.

## Install

```bash
pi install .
```

Or from GitHub:

```bash
pi install git:github.com/rokcso/pi-volcengine-agent-plan
```

## Setup

1. Run `/login` in pi, select **volcengine-agent-plan**, and enter your Agent Plan API key.
2. Set as default in `~/.pi/agent/settings.json`:

```json
{
  "defaultProvider": "volcengine-agent-plan",
  "defaultModel": "doubao-seed-2.0-pro",
  "defaultThinkingLevel": "medium"
}
```

> Use `/model volcengine-agent-plan/<model-id>` to switch models at runtime. Available models are listed in the [official Agent Plan docs](https://www.volcengine.com/docs/82379/2522860). Reasoning models support 6 thinking levels cycled with **Shift+Tab**.

## Develop

Extensions run via [jiti](https://github.com/unjs/jiti) — edit `extensions/index.ts` and run `/reload` in pi. No build step needed.

```bash
npm install
npx tsc --noEmit
```

Model definitions live in the `MODELS` array, aligned with the [official Agent Plan model table](https://www.volcengine.com/docs/82379/2522860).

## License

MIT
