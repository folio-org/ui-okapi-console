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


## Introduction

Two sets of software are involved here: on the server side, Okapi with
its modules (including the Users module); and on the client side,
Stripes with its modules (include the Okapi Console and the Users
module).

To exercise the Users module from a Stripes UI, you need run both
pieces of software. Developers may wish to install, build and run it
all locally, but there are alternatives:

* You can use the [FOLIO Ansible Playbook](https://github.com/folio-org/folio-ansible)
  to bring up a virtual machine runing Okapi with modules including
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
  (But see the Appendix for how module deployment is done in this
  context.)

If you are using any of these alternative approaches, you can skip the
server-side instructions and go straight to the
[client side](#client-side).


## Server side

### Fetch, build and run Okapi

Full instructions are found in
[the Okapi documentation](https://github.com/folio-org/okapi/blob/master/doc/guide.md#compiling-and-running)
but the brief version is:

    shell1$ git clone git@github.com:folio-org/okapi
    shell1$ cd okapi
    shell1$ mvn install
    shell1$ mvn exec:exec

Stopping and re-running Okapi in this way (`mvn exec:exec`) gives a
new instance of Okapi with no state left over from earlier runs. This
allows the Okapi Console to run against a known state.

### Fetch and build the RAML tools

[These tools](https://github.com/folio-org/raml-module-builder)
auto-generate the server-side interface glue code from RAML
specifications, and are needed to build the Users module. Leaving
Okapi running its own shell, fetch and build in another shell:

    shell2$ git clone git@github.com:folio-org/raml-module-builder
    shell2$ cd raml-module-builder
    shell2$ mvn install
    shell2$ cd ..

### Fetch and build the Users module

We need to build [the Users module](https://github.com/folio-org/mod-users),
but we don't need to run it: Okapi will do that for us when needed.

    shell2$ git clone git@github.com:folio-org/mod-users
    shell2$ cd mod-users
    shell2$ mvn install

The most important output is `mod-users/target/users-fat.jar`, which
we will later be asking Okapi to run for us. You can test that it
works OK by running it manually:

    shell2$ java -jar target/mod-users-fat.jar
    starting rest verticle service..........
    [etc.]

Now kill the running module, so that Okapi can start it as needed.


## Client side

### Fetch and build Stripes

The full steps to fetch and build Stripes are described in
[Building and running Stripes from git checkouts](https://github.com/folio-org/stripes-core/blob/master/doc/building-from-git-checkouts.md).
Alternatively, you may be able to build only `stripes-core` locally,
and fetch the dependencies (`stripes-connect`, etc.) from the NPM
repository: see
[the Quick Start section](https://github.com/folio-org/stripes-core/blob/master/README.md#quick-start)
of that document.

Modules, including `ui-okapi-console` and `users`, may be added to the
Stripes configuration as described in
[the Adding more modules](https://github.com/folio-org/stripes-core/blob/master/doc/building-from-git-checkouts.md#adding-more-modules)
section of the build guide. In summary, you will need to add the
desired modules to your `stripes.config.js` file, and either arrange
for NPM to be able to find the modules from its registry or
symbolically link the relevant source checkouts into place.

### Run the Okapi Console locally

Now you can run the UI server in the `stripes-core` directory, and it
will pulls in the specified modules and make the complete set of HTML,
CSS and JavaScript assets available:

    shell2$ npm run start

Point your browser to [`http://localhost:3000`](http://localhost:3000)
to see the Stripes application's home page. From there, you can
navigate to the Okapi Console.

(You can also go to the Users UI module, but it won't work yet because
the server-side module has not been added.)


#### Add the Users module

From within the running Stripes UI, follow these steps.

First, fill in the **module proxy** section:

* Click the **Okapi Console** menu item in the bar at the top of the page.
* Click the **Modules** menu item below the top bar.
* Click **Add module**.
* Fill in the **Name** textbox with `Users` (or any name).
* You can ignore the **Provides** and **Requires** entries for our present purposes.
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
  `java -jar ../mod-users/target/mod-users-fat.jar -Dhttp.port=%p embed_mongo=true`
* You can ignore the **Start command** and **Stop command** entries in this scenario.
* Press the **Submit** button at bottom right. (Another empty
  deployment entry appears below the one you filled in. Ignore it.)

#### Add the sample users

For historical reasons, the sample users are maintained along with the
source code for the authorization module, `mod-auth`. So we need to
clone this repository and use it to create the sample tenant and add
the users.

    $ git clone git@github.com:folio-org/mod-auth
    $ cd mod-auth/testing/auth_test
    $ ./add-users.sh

