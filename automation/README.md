# Okapi Console automation

Adding modules by walking through the Okapi Console pages -- as described at https://github.com/folio-org/ui-okapi-console/blob/master/doc/running-a-complete-system.md#add-and-deploy-the-users-module -- can be a tedious process. Scripts in this directory allow the process to be automated.

At present we have the following scripts:

* `01-install-tenant.sh` -- sets up the magic well-known tenant `diku`. Must be run before any of the other scripts.
* `02-install-users.sh` -- installs and deploys the Users module, associates it with the `diku` tenant, and inserts some sample users.
* `03-install-inventory.sh` -- installs and deploys the inventory-storage module from mod-metadata, associates it with the `diku` tenant, and inserts a sample item.

