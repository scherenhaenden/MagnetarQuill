#!/usr/bin/env bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting validation suite...${NC}\n"

# 1. Linting
echo -e "${YELLOW}[1/4] Running Linter & Info-Docs Checks...${NC}"
npm run lint
LINT_STATUS=$?
echo ""

# 2. Testing
echo -e "${YELLOW}[2/4] Running Unit Tests (without coverage thresholds)...${NC}"
npx ng test lib-magnetar-quill --watch=false
TEST_STATUS=$?
echo ""

# 3. Build Library
echo -e "${YELLOW}[3/4] Building Library...${NC}"
npm run build-lib
BUILD_LIB_STATUS=$?
echo ""

# 4. Build App
echo -e "${YELLOW}[4/4] Building Application...${NC}"
npm run build
BUILD_APP_STATUS=$?
echo ""

# Summary Dashboard
echo -e "=========================================="
echo -e "           VALIDATION SUMMARY             "
echo -e "=========================================="

FAILED=0

if [ $LINT_STATUS -eq 0 ]; then
  echo -e "Linting Checks:  ${GREEN}PASSED${NC}"
else
  echo -e "Linting Checks:  ${RED}FAILED${NC}"
  FAILED=1
fi

if [ $TEST_STATUS -eq 0 ]; then
  echo -e "Unit Tests:      ${GREEN}PASSED${NC}"
else
  echo -e "Unit Tests:      ${RED}FAILED${NC}"
  FAILED=1
fi

if [ $BUILD_LIB_STATUS -eq 0 ]; then
  echo -e "Library Build:   ${GREEN}PASSED${NC}"
else
  echo -e "Library Build:   ${RED}FAILED${NC}"
  FAILED=1
fi

if [ $BUILD_APP_STATUS -eq 0 ]; then
  echo -e "App Build:       ${GREEN}PASSED${NC}"
else
  echo -e "App Build:       ${RED}FAILED${NC}"
  FAILED=1
fi

echo -e "=========================================="

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}All checks passed successfully!${NC}\n"
  exit 0
else
  echo -e "${RED}Some validation checks failed.${NC}\n"
  exit 1
fi
