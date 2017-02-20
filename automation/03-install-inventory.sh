#!/bin/sh

# Assumptions:
# * mod-metadata is checked out and built next to ui-okapi-console
# * Okapi is already running

# To build the inventory-storage module:
#	$ cd ../..
#	$ git clone https://github.com/folio-org/mod-metadata.git
#	$ git submodule init && git submodule update
#	$ cd inventory-storage
#	$ mvn install

OKAPI_URL=http://localhost:9130

# Set up proxying for "inventory-storage" module
curl -X POST -w '\n' -D - -H 'Content-type: application/json' \
    -d @COPIES/mod-metadata/inventory-storage/ModuleDescriptor.json \
    $OKAPI_URL/_/proxy/modules

# Deploy the "inventory-storage" module
curl -X POST -w '\n' -D - -H 'Content-type: application/json' \
    -d @COPIES/mod-metadata/inventory-storage/DeploymentDescriptor.json \
    $OKAPI_URL/_/deployment/modules

# Enable the "inventory-storage" module for the "diku" tenant
curl -X POST -w '\n' -D - -H 'Content-type: application/json' \
    -d '{"id": "inventory-storage"}' \
    $OKAPI_URL/_/proxy/tenants/diku/modules

# Add sample records for now
itemdir=COPIES/mod-metadata/inventory-storage/sample-data/items
if [ "x$1" = x-o ]; then
   # Use old hand-made items
   itemdir=sample-items
fi

(cd sample-items; perl csv2json_items.pl sample-items.csv)
for f in $itemdir/*.json; do
    curl -w '\n' -X POST -D - \
        -H "Content-type: application/json" \
        -H "X-Okapi-Tenant: diku" \
        -d @$f http://localhost:9130/item-storage/items
    done

