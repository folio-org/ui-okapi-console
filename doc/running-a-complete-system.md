# Running a complete FOLIO system

This document explains the necessary steps to run a complete FOLIO
system, including using the Okapi Console to start modules on the
server. We will use the Users module as our exemplar.

<!-- ../../okapi/doc/md2toc -l 2 running-a-complete-system.md -->
* [Introduction](#introduction)
* [Server side](#server-side)
    * [Fetch, build and run Okapi](#fetch-build-and-run-okapi)
    * [Fetch and build the RAML tools](#fetch-and-build-the-raml-tools)
    * [Fetch and build the Users module](#fetch-and-build-the-users-module)
* [Client side](#client-side)
    * [Fetch and build Stripes](#fetch-and-build-stripes)
    * [Disable authentication](#disable-authentication)
    * [Run the Stripes UI](#run-the-stripes-ui)
    * [Set up the module, tenant and users](#set-up-the-module-tenant-and-users)
        * [Add and deploy the Users module](#add-and-deploy-the-users-module)
        * [Create the tenant that will own the users](#create-the-tenant-that-will-own-the-users)
        * [Enable the Users module for the tenant](#enable-the-users-module-for-the-tenant)
        * [Add the sample users](#add-the-sample-users)
    * [View the users](#view-the-users)


## Introduction

Two sets of software are involved here: on the server side, Okapi with
its modules (including the Users module); and on the client side,
Stripes with its modules (include the Okapi Console and the Users
module).

To exercise the Users module from a Stripes UI, you need to run both
sets of software. Developers may wish to install, build and run it
all locally, but there are alternatives:

* You can use the [FOLIO Ansible Playbook](https://github.com/folio-org/folio-ansible)
  to bring up a virtual machine running Okapi with modules including
  Users already running. This exposes its Okapi service on the same
  port (9130) as a local Okapi, so no configuration changes are needed
  in the UI.

* You can configure your local UI to connect to a remote Okapi
  service, perhaps running as part of the continuous integration
  scheme. Do this by changing the Okapi URL in the `okapi.url` setting
  in the `stripes.config.js` file.

* Alternatively, you can use an existing UI and Okapi in a CI
  installation on an AWS cluster by pointing a browser to
  [`http://redux-okapi-test-aws.indexdata.com/`](http://redux-okapi-test-aws.indexdata.com/)
  (But module deployment must be done differently in this context, as
  the JAR files are typically not available.)

If you are using any of these alternative approaches, you can skip the
server-side instructions and go straight to the
[client side](#client-side).

We will assume that all the software is checked out in the same parent
directory, which we will designate as `$FOLIO_ROOT`.


## Server side

### Fetch, build and run Okapi

Full instructions are found in the
[Okapi documentation](https://github.com/folio-org/okapi/blob/master/doc/guide.md#compiling-and-running)
but the brief version is:

	$ cd $FOLIO_ROOT
	$ git clone https://github.com/folio-org/okapi.git
	$ cd okapi
	$ mvn install
	$ mvn exec:exec

Stopping and re-running Okapi in this way (`mvn exec:exec`) gives a
new instance of Okapi with no state left over from earlier runs. This
allows the Okapi Console to run against a known state.

### Fetch and build the RAML tools

These [tools](https://github.com/folio-org/raml-module-builder)
auto-generate the server-side interface glue code from RAML
specifications, and are needed to build the Users module. Leaving
Okapi running its own shell, fetch and build in another shell:

	$ cd $FOLIO_ROOT
	$ git clone --recursive https://github.com/folio-org/raml-module-builder.git
	$ cd raml-module-builder
	$ mvn install

### Fetch and build the Users module

We need to build the [Users module](https://github.com/folio-org/mod-users),
but we don't need to run it: Okapi will do that for us when needed.

	$ cd $FOLIO_ROOT
	$ git clone --recursive https://github.com/folio-org/mod-users.git
	$ cd mod-users
	$ git submodule init
	$ git submodule update
	$ mvn install

The most important output is `mod-users/target/users-fat.jar`, which
we will later be asking Okapi to run for us.

If you wish, you can test that it works OK by running it manually:

	$ java -jar target/mod-users-fat.jar
	starting rest verticle service..........
	[etc.]
	... INFO Succeeded in deploying verticle

The output can be voluminous and rather opaque, but if it contains the
line "Succeeded in deploying verticle" then all is well. Now kill the
running module, so that Okapi can start it as needed.


## Client side

### Fetch and build Stripes

The steps to configure Stripes are explained in the
[Quick Start](https://github.com/folio-org/stripes-core/blob/master/doc/quick-start.md)
document.

As explained there, to use local development versions of any module,
follow the 'yarn link'
[instructions](https://github.com/folio-org/stripes-core/blob/master/doc/quick-start.md#using-local-code).
Otherwise, Yarn will use the published packages from the "npm-folio" repository.

Add the `ui-okapi-console` module to the Stripes configuration:

    $ cd $MY_DEV/stripes-sample-platform

Edit the file `stripes.config.js` to add `@folio/okapi-console`.
Note that this module is not yet published, so use a local git checkout
and follow those 'yarn link' instructions.

### Disable authentication

By default, the Stripes UI requires you to log in before you can
access any of the UI modules. But making that work entails building
and installing several authentication-related server-side modules, so
it is simpler to modify the configuration of Stripes so that
authentication is not required. (Don't do this for production
systems!)

Edit the file `stripes.config.js`, and in the `config` section change
`disableAuth: false` to `disableAuth: true`.

### Run the Stripes UI

Now you can run the UI server in your `stripes-sample-platform` directory, and it
will pull in the specified modules and make the complete set of HTML,
CSS and JavaScript assets available:

	$ cd $MY_DEV/stripes-sample-platform
	$ yarn start

Point your browser to [`http://localhost:3000`](http://localhost:3000)
to see the Stripes application's home page. From there, you can
navigate to the Okapi Console.

You can also go to the Users UI module, but unless you are using a
virtual machine (e.g. folio-backend) or some other method of deploying
the modules and test data as explained above, then it will not
work yet because the server-side module has not been set up.
So continue with the following steps using the Okapi Console.

### Set up the module, tenant and users

#### Add and deploy the Users module

From within the running Stripes UI, follow these steps.

First, fill in the **module proxy** section:

* Click the **Okapi Console** menu item in the bar at the top of the page.
* Click the **Modules** menu item below the top bar.
* Click **Add module**.
* Fill in the **Name** textbox with `Users` (or any name).
* Click the **+Add provision** button next to the **Provides** heading.
* Type `_tenant` into the **Module ID** box.
* Type `1.0.0` into the **Version** box. (i.e. as specified in mod-users/ModuleDescriptor.json)
* You can ignore the **+Add requirement** entry for our present purposes.
* Click the **+Add route** button next to the **Routing** heading.
* Click the new **+Add HTTP method** button that has appeared to the right
  of the new **Methods** caption.
* Type `GET` into the **Methods** box.
* Click the **+** button to the right of this box.
  Another empty **Methods** box appears below the one you filled in.
* Type `POST` into the new **HTTP method** box and click the **+** button.
  Another empty **Methods** box appears below the one you filled in.
* Type `PUT` into the new **HTTP method** box and click the **+** button.
  Another empty **Methods** box appears below the one you filled in.
* Type `DELETE` into the new **HTTP method** box and click the **+** button.
  (Another empty **Methods** box appears below the one you filled in. Ignore it.)
* Fill in the three elements of the routing entry as follows:
    * Request path to module: `/users`
    * Priority level: `30`
    * Request type: `request-response`
* Click the **+** button to the right of the routing entry. (Another
  empty routing entry appears below the one you filled in. Ignore it.)
* Click the **Add module proxy** button below the routing entries.

Now deploy the module locally to the running Okapi node:

* Pull down the **Node** dropdown (below the **Service ID** and **Inst ID** read-only textboxes), and select the only value that is
  presented, `http://localhost:9130/`.
* Fill in the **Exec** entry with the following command-line, which
  Okapi will use to start the Users module:
  `java -jar ../mod-users/target/mod-users-fat.jar -Dhttp.port=%p embed_postgres=true`
* You can ignore the **Start command** and **Stop command** entries in this scenario.
* Press the **Submit** button at bottom right. (Another empty
  deployment entry appears below the one you filled in. Ignore it.)

#### Create the tenant that will own the users

Presently, the Users module is locked to a specific tenant, with the
ID `diku`. This will be fixed in the future, but we live with it for
now. To create the tenant, go back to the Okapi Console part of the
Stripes UI, and follow these steps:

* Click the **Tenants** link.
* Click the **Add tenant** link at the bottom.
* Fill in the **ID** field with the value `diku`.
* Fill in the **Name** and **Description** fields however you wish.
* Click the **Add Tenant** button at the bottom.

You will be returned to the tenant list, with the new Diku tenant
listed.

#### Enable the Users module for the tenant

* Click the **Edit** link next to the Diku tenant.
* At the bottom of the edit page is a list of modules available to the
  tenant. One of them (possible the only one) is Users. Click the
  **Enable** link next to it.

The Users module is now inserted into Okapi, deployed and enabled for
the Diku tenant.

#### Add the sample users

We may introduce a bulk-ingest facility into the Okapi Console or the
Users module later; but for now, the sample users must be added from
the command line.

For historical reasons, the JSON files describing the sample users are
maintained as part of the FOLIO Ansible module, `folio-ansible`. So we need
to clone this repository and use it to add the users.

	$ cd $FOLIO_ROOT
	$ git clone https://github.com/folio-org/folio-ansible.git
	$ cd folio-ansible/roles/mod-users-data/files
	$ for f in *; do
	    curl -w '\n' -X POST -D - \
	      -H "Content-type: application/json" \
	      -H "X-Okapi-Tenant: diku" \
	      -d @$f http://localhost:9130/users
	    done

### View the users

Finally, back in the Stripes UI, you can click on the top-level
**Users** heading and see the displayed list of users.

