#!/bin/bash
# check-fingerprint.sh

# 1. Generate fingerprint for current working directory
echo "Generating fingerprint for current state..."
npx @expo/fingerprint fingerprint:generate > current-fingerprint.json

# 2. Generate fingerprint for the last commit
echo "Generating fingerprint for HEAD..."
# Stash any local changes temporarily if needed
git stash -q
git checkout -q HEAD
npx @expo/fingerprint fingerprint:generate > head-fingerprint.json
# Go back
git checkout -q -
git stash pop -q 2>/dev/null

# 3. Diff the two files
echo "Comparing fingerprints..."
npx @expo/fingerprint fingerprint:diff current-fingerprint.json head-fingerprint.json

# Cleanup
rm current-fingerprint.json head-fingerprint.json
