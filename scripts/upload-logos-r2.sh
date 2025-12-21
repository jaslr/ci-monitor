#!/bin/bash
# Upload logos to Cloudflare R2 bucket (REMOTE/Production)
# Run from project root: ./scripts/upload-logos-r2.sh

BUCKET="ci-monitor-logos"

echo "Uploading infrastructure logos to REMOTE R2 bucket: $BUCKET"
for file in logos-temp/infra/*.svg; do
  if [ -f "$file" ]; then
    name=$(basename "$file")
    echo "  Uploading infra/$name..."
    npx wrangler r2 object put "$BUCKET/infra/$name" --file="$file" --content-type="image/svg+xml" --remote 2>/dev/null
  fi
done

echo ""
echo "Uploading tech stack logos to REMOTE R2 bucket: $BUCKET"
for file in logos-temp/techstack/*.svg; do
  if [ -f "$file" ]; then
    name=$(basename "$file")
    echo "  Uploading techstack/$name..."
    npx wrangler r2 object put "$BUCKET/techstack/$name" --file="$file" --content-type="image/svg+xml" --remote 2>/dev/null
  fi
done

echo ""
echo "Done! Logos uploaded to REMOTE R2 bucket: $BUCKET"
