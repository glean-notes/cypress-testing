#!/bin/bash

set -eux

LOG_FAILURES_TO_KIBANA="true"

export CHROME_LOG_FILE="chrome_debug.log"

# Would normally be dynamically set for our branch builds, just hardcode for this example repo
GLEAN_URL=https://cypress-testing-2.dev.glean.ninja
ADMIN_URL=https://cypress-testing-2.dev.glean.ninja/admin
COOKIE_DOMAIN=cypress-testing-2.dev.glean.ninja

CYPRESS_baseUrl=$GLEAN_URL cypress run --browser="chrome" --headed --project . --env COOKIE_DOMAIN="$COOKIE_DOMAIN",TEST_HELPER_USR="$TEST_HELPER_USR",TEST_HELPER_PSW="$TEST_HELPER_PSW",ADMIN_URL="$ADMIN_URL",GLEAN_URL="$GLEAN_URL",LOG_FAILURES_TO_KIBANA=$LOG_FAILURES_TO_KIBANA,DELETE_SUCCESS_VIDEOS=true --spec "./integration/ci/**/*.spec.ts"
