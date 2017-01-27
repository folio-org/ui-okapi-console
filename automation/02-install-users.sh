#!/bin/sh

# Assumptions:
# * mod-users is checked out next to ui-okapi-console
# * folio-ansible is checked out next to ui-okapi-console
# * Okapi is already running

OKAPI_URL=http://localhost:9130
TMP=/tmp/okapi.$$
trap 'rm -f $TMP' 0 1 15

# Set up proxying for "users" module
curl -X POST -w '\n' -D - -H 'Content-type: application/json' \
    -d @../../mod-users/ModuleDescriptor.json \
    $OKAPI_URL/_/proxy/modules

# Deploy the "users" module
curl -X POST -w '\n' -D - -H 'Content-type: application/json' \
    -d @../../mod-users/DeploymentDescriptor.json \
    $OKAPI_URL/_/deployment/modules | tee $TMP

srvcId=`sed -n 's/.*srvcId" : "\(.*\)",/\1/p' $TMP`
echo srvcId=$srvcId

# Enable the "users" module for the "diku" tenant
curl -X POST -w '\n' -D - -H 'Content-type: application/json' \
    -d '{"id": "users-module"}' \
    $OKAPI_URL/_/proxy/tenants/diku/modules

# Add sample users
for f in ../../folio-ansible/roles/mod-users-data/files/*; do
    curl -w '\n' -X POST -D - \
        -H "Content-type: application/json" \
        -H "X-Okapi-Tenant: diku" \
        -d @$f http://localhost:9130/users
    done

