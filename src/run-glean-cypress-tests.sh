#!/bin/bash

set -eux

LOG_FAILURES_TO_KIBANA="true"

export CHROME_LOG_FILE="chrome_debug.log"

# Would normally be dynamically set for our branch builds, just hardcode for this example repo
GLEAN_URL=http://cypress-testing-s3.s3-website.eu-west-2.amazonaws.com
ADMIN_URL=http://cypress-testing-s3.s3-website.eu-west-2.amazonaws.com
COOKIE_DOMAIN=cypress-testing-s3.s3-website.eu-west-2.amazonaws.com

CYPRESS_baseUrl=$GLEAN_URL cypress run --browser="chrome" --headed --project . --env COOKIE_DOMAIN="$COOKIE_DOMAIN",TEST_HELPER_USR="$TEST_HELPER_USR",TEST_HELPER_PSW="$TEST_HELPER_PSW",ADMIN_URL="$ADMIN_URL",GLEAN_URL="$GLEAN_URL",LOG_FAILURES_TO_KIBANA=$LOG_FAILURES_TO_KIBANA,DELETE_SUCCESS_VIDEOS=true --spec "./integration/ci/**/*.spec.ts"
