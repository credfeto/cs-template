# Git Examples

[Back to Git Instructions](git.instructions.md) | [Back to Global Instructions Index](index.md)

## Git Identity Check Script

Run before any commit to verify identity and GPG signing:

```bash
CURRENT_EMAIL=$(git config user.email)
if [ "$CURRENT_EMAIL" = "andy@nanoclaw.ai" ] || [ -z "$CURRENT_EMAIL" ]; then
  echo "ERROR: Git is configured with the wrong identity ($CURRENT_EMAIL). Aborting."
  exit 1
fi
if [ "$(git config commit.gpgsign)" != "true" ]; then
  echo "ERROR: GPG signing is not enabled. Aborting."
  exit 1
fi
```

## Template Rule Escalation — Issue Command

```bash
gh issue create --repo credfeto/cs-template \
  --title "<short description of the rule change>" \
  --label "AI-Work" \
  --body "**Source repository**: <repo where need was discovered>

**Current behaviour / gap**: <what is missing or inconsistent>

**Proposed rule text**: <concrete rule update or new instruction text>

**Reason for template propagation**: <why this should apply across all repos>"
```
