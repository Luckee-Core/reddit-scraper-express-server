# Contributing

Thanks for helping improve the Reddit Scraper Express Server.

## Before you code

1. Read [`.cursor/architecture/README.md`](.cursor/architecture/README.md) and [`.cursor/rules/AGENTS.md`](.cursor/rules/AGENTS.md).
2. For OSS release standards, see [mentorai-server `data/open-source/`](https://github.com/trouthouse-tech/mentorai-server/tree/main/data/open-source).

## Patterns (short)

- Router factories: `createXRouter(): Router` — never export router instances.
- Handlers: validate request → `processX()` → try/catch → `{ success, error }`.
- Business logic in `process-*.ts` files under `src/services/{feature}/`.
- Use `type`, not `interface`, in new code.
- JSDoc on exported routers, handlers, and `processX()` functions.
- Emoji logging per ADR 006.
- Update `src/services/api-docs/api-docs-catalog.ts` in the same PR when routes change.

## Pull requests

1. Open an issue for large changes when possible.
2. Keep PRs focused; match existing style in touched files.
3. Run `npm run typecheck` and `npm run build` before submitting.
4. Update README or `docs/` if you add routes, env vars, or change response shapes.

## Security

Report vulnerabilities per [`SECURITY.md`](SECURITY.md) — not via public issues with exploit details.
