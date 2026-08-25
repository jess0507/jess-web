#!/usr/bin/env bash
# PreToolUse(Bash) hook:擋下從本機直接部署的指令。
#
# 本專案的部署管道是 .github/workflows/deploy.yml:
# push 一個 x.y.z 格式的 git tag → GitHub Actions 建置並部署,
# 版本號由 git tag 決定(git describe --tags)。
#
# 本機 firebase deploy 會繞過這條管道,讓線上版本與 tag 脫節,
# 且用的是本機 .env 而非 GitHub secrets。

CMD="$(jq -r '.tool_input.command // ""')"

if printf '%s' "$CMD" | grep -qE '(firebase[[:space:]]+deploy|(npm|yarn|pnpm)[[:space:]]+run[[:space:]]+deploy)'; then
  cat <<'JSON'
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "本專案禁止從本機直接部署。部署由 .github/workflows/deploy.yml 負責,觸發條件是 push 一個 x.y.z 格式的 git tag。請先詢問使用者是否要建立並推送新 tag(例如 git tag 3.0.2 && git push origin 3.0.2),不要自行決定版本號,也不要改用其他指令繞過這個檢查。"
  }
}
JSON
fi

exit 0
