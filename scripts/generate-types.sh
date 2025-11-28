#!/bin/bash
# Generate TypeScript types from Supabase schema
# Usage: ./scripts/generate-types.sh
#
# Prerequisites:
# - Supabase CLI installed: npm install -g supabase
# - SUPABASE_PROJECT_ID environment variable set
# - Logged in to Supabase: supabase login
#
# This script generates types from the remote Supabase database
# and outputs them to types/supabase.ts

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Generating TypeScript types from Supabase...${NC}"

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Error: Supabase CLI is not installed.${NC}"
    echo "Install it with: npm install -g supabase"
    exit 1
fi

# Check for project ID
if [ -z "$SUPABASE_PROJECT_ID" ]; then
    # Try to get from .env file
    if [ -f ".env" ]; then
        export $(grep -v '^#' .env | xargs)
    fi
    
    if [ -z "$SUPABASE_PROJECT_ID" ]; then
        echo -e "${RED}Error: SUPABASE_PROJECT_ID environment variable is not set.${NC}"
        echo "Set it with: export SUPABASE_PROJECT_ID=your-project-id"
        exit 1
    fi
fi

# Output file
OUTPUT_FILE="types/supabase.ts"

# Generate types
echo "Generating types for project: $SUPABASE_PROJECT_ID"
supabase gen types typescript --project-id "$SUPABASE_PROJECT_ID" > "$OUTPUT_FILE"

# Add header comment
TEMP_FILE=$(mktemp)
cat > "$TEMP_FILE" << 'EOF'
/**
 * Supabase Database Types
 * 
 * Auto-generated from Supabase schema.
 * DO NOT EDIT MANUALLY - run `npm run generate:types` to regenerate.
 * 
 * @generated
 */

EOF
cat "$OUTPUT_FILE" >> "$TEMP_FILE"
mv "$TEMP_FILE" "$OUTPUT_FILE"

echo -e "${GREEN}✓ Types generated successfully: $OUTPUT_FILE${NC}"

# Show summary
TABLES=$(grep -c "Row:" "$OUTPUT_FILE" || echo "0")
echo "  Tables found: $TABLES"

