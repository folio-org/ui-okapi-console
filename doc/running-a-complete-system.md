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
    shell2$ cd ..

The most important output is `mod-users/target/users-fat.jar`, which
we will later be asking Okapi to run for us.

## Client side

XXX To be done -- should be able to re-use some of the old
documentation in ../testing-the-circulation-module.md

