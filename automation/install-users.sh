#!/bin/sh

# Assumes that Okapi is already running
OKAPI_URL=http://localhost:9130
TMP=/tmp/okapi.91222
#trap 'rm -f $TMP' 0 1 15

if true; then
# Create the "diku" tenant
curl -X POST -w '\n' -D - -H 'Content-type: application/json' \
    -d '{"id": "diku", "name": "Diku"}' \
    $OKAPI_URL/_/proxy/tenants
fi

if true; then
# Set up proxying for "users" module
curl -X POST -w '\n' -D - -H 'Content-type: application/json' \
    -d @../../mod-users/ModuleDescriptor.json \
    $OKAPI_URL/_/proxy/modules
fi

if true; then
# Deploy the "users" module
curl -X POST -w '\n' -D - -H 'Content-type: application/json' \
    -d @../../mod-users/DeploymentDescriptor.json \
    $OKAPI_URL/_/deployment/modules | tee $TMP
fi

srvcId=`sed -n 's/.*srvcId" : "\(.*\)",/\1/p' $TMP`
echo srvcId=$srvcId

if true; then
# Enable "diku" tenant to use "users" module
curl -X POST -w '\n' -D - -H 'Content-type: application/json' \
    -d '{"id": "users-module"}' \
    $OKAPI_URL/_/proxy/tenants/diku/modules
fi

if false; then
# Initialise "users" module for "diku" tenant
# ### This can't work for more than one module, as we need the /tenant route
curl -X POST -w '\n' -D - -H 'Content-type: application/json' \
    -H "X-Okapi-Tenant: diku" \
    -d '{"id": "'$srvcId'"}' \
    $OKAPI_URL/tenant
fi

