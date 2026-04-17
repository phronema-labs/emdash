#!/bin/bash
# Deploy Phronema Business Starter to Hetzner
# Usage: ./deploy.sh <server-ip> [domain]
#
# Prerequisites on the Hetzner server:
#   - Docker & Docker Compose installed
#   - SSH access configured

set -e

SERVER=${1:?"Usage: ./deploy.sh <server-ip> [domain]"}
DOMAIN=${2:-""}
REMOTE_DIR="/opt/emdash-demo"

echo "==> Deploying to $SERVER..."

# If a domain was provided, update the Caddyfile
if [ -n "$DOMAIN" ]; then
  echo "==> Configuring SSL for $DOMAIN"
  sed -i.bak "s|:80 {|$DOMAIN {|" Caddyfile
fi

# Sync the repo to the server (exclude node_modules, data)
echo "==> Syncing files..."
ssh root@"$SERVER" "mkdir -p $REMOTE_DIR"
rsync -az --delete \
  --exclude node_modules \
  --exclude .git \
  --exclude "*/data.db" \
  --exclude "*/uploads/*" \
  ../../ root@"$SERVER":"$REMOTE_DIR"/

# Build and start on the server
echo "==> Building and starting containers..."
ssh root@"$SERVER" "cd $REMOTE_DIR/templates/phronema-business && docker compose up -d --build"

# Seed the database if it's a fresh deploy
echo "==> Seeding database (if empty)..."
ssh root@"$SERVER" "cd $REMOTE_DIR/templates/phronema-business && docker compose exec emdash node -e \"
const fs = require('fs');
if (!fs.existsSync('/app/data/data.db')) {
  console.log('Fresh deploy — run: docker compose exec emdash npx emdash seed');
} else {
  console.log('Database exists, skipping seed');
}
\""

# Restore Caddyfile if we modified it
if [ -n "$DOMAIN" ]; then
  mv Caddyfile.bak Caddyfile 2>/dev/null || true
fi

echo ""
echo "==> Done! Site is live at:"
if [ -n "$DOMAIN" ]; then
  echo "    https://$DOMAIN"
else
  echo "    http://$SERVER"
fi
echo ""
echo "    Admin: http://$SERVER/_emdash/admin"
echo ""
echo "To seed the database on first deploy:"
echo "    ssh root@$SERVER 'cd $REMOTE_DIR/templates/phronema-business && docker compose exec emdash npx emdash seed'"
