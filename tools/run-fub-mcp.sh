#!/bin/sh
# Starts the Follow Up Boss connector for Claude with the key from ~/.fub/followupboss.env.
# The key never goes in Claude's settings files or in git.
set -a
. "$HOME/.fub/followupboss.env"
set +a
exec node "$HOME/mcp-servers/followupboss-mcp-server/index.js"
