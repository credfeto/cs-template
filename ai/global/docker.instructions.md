# Docker Instructions

> Load when: any `Dockerfile`, `Containerfile`, `docker-compose*.yml`, `compose.yml`, or `.dockerignore` is present, or container work is needed.

[Back to Global Instructions Index](index.md)

## Container Runner Detection

- The container runner on a given machine may be **Docker or Podman** — never assume one is installed.
- Detect which is available and use that: prefer `docker` if present, otherwise fall back to `podman`. Check with `command -v docker` / `command -v podman` before running any container command.
- Do the same for the compose tool: `docker compose` (or legacy `docker-compose`) vs `podman-compose`.
- Do not hardcode `docker` in scripts that need to run on either — resolve the runner once at the top of the script and use a variable.

## Dockerfile Authoring

- Use multi-stage builds: a `build`/`sdk` stage for compiling/installing, and a minimal runtime stage that copies only the built artefacts across.
- Pin base image versions explicitly (e.g. `mcr.microsoft.com/dotnet/sdk:9.0` or a digest) — never `latest`.
- Order layers from least to most frequently changing so the build cache is preserved (dependency manifests and restore steps before source copy).
- Run the container process as a non-root user; create a dedicated user in the image rather than running as `root`.
- Add a `.dockerignore` covering build output, `.git`, local secrets/env files, and IDE directories — never rely on the daemon to filter these out of the build context.
- Never `COPY`/`ADD` secrets, credentials, or `.env` files into an image layer — even if removed in a later layer, they remain in the image history. Pass secrets at build time via BuildKit `--secret` (or the Podman equivalent) or inject them at runtime.

## Compose Conventions

- Pin image tags/digests in `docker-compose.yml` / `compose.yml` the same way as Dockerfiles — no `latest`.
- Define explicit named networks rather than relying on the default network when more than one service needs to communicate.
- Use named volumes for persistent state; bind-mount only for local development conveniences (source code, config overrides).
- Keep environment-specific overrides in a separate override file (e.g. `compose.override.yml`) rather than branching logic inside the base file.

## Security Basics

- Prefer minimal base images (`-alpine`, `-slim`, or distroless) for runtime stages to reduce attack surface.
- Scan images for known vulnerabilities before publishing (e.g. `docker scout`, `trivy`, or the CI-configured scanner) — see [security.instructions.md](security.instructions.md#dependency-vulnerability-scanning) for the general dependency-scanning policy.
- Never bake secrets, credentials, or tokens into an image layer — see the Dockerfile Authoring section above.
- Set explicit resource limits (memory/CPU) in compose/runtime configuration for anything other than local development.
