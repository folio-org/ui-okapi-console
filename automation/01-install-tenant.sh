#!/bin/sh

# Assumptions:
# * Okapi is already running

OKAPI_URL=http://localhost:9130

# Create the "diku" tenant
curl -X POST -w '\n' -D - -H 'Content-type: application/json' \
    -d '{"id": "diku", "name": "Diku"}' \
    $OKAPI_URL/_/proxy/tenants
