# loom-tm-ed
TM Executive Dashboard weaver for Loom.  This front-end is packaged for deployment by [loom-tm](https://github.com/HewlettPackard/loom-tm).  For more information on Loom look at its [github repo](https://github.com/HewlettPackard/loom).

## Install

If you intend to build other Javascript projects on the same machine, e.g. loom, you will need access to other versions of node.  Installing and using [nvm](https://github.com/creationix/nvm) (Node Version Manager) will make life a lot easier.

1. Ensure you have at least Node v6.8.1 & NPM v3 installed
2. Clone the repo, then: `npm install`

## Run in using Webpack Dev Server

Run with Development settings: `npm start`.

Run with Production settings: `npm run start:prod`.

_N.B_ If you need to provide a custom backend Authority you can use the LOOM_SERVER variable passed to webpack. See `npm
 start:dev` in package.json:

 ```webpack-dev-server --host 0.0.0.0 --define LOOM_SERVER='http://tm.dev:9099/loom' --progress --colors --display-chunks --display-error-details --hot --config webpack.config.js```

## Building using npm

`npm run build`, then check the contents of the ./dist directory in the project.

## Building using maven
> Maven is used to package and release artifacts for inclusion in other products.

Install Java 1.8 - note: OpenJDK has been tested but not used in production

Install maven v3.3.9

To build:

```
$ mvn clean install
```

Note that to ensure that the latest SNAPSHOT dependencies are being used the `-U` option should be used:

```sh
$ mvn -U clean install
```

## Todo:

### Loading screen
This should follow the loading screen designs and feature a dedicated path/page that is aware of the Get Thread requests/responses and is able to determine if the dashboard is ready to be displayed.
The designs shows 5 or 6 stages of loading (each with a separate message), it is anticipated that this process will be linear and be displayed over a time frame of ~20s to allow time for the Loom API to collate the required data from it's own backends (DMA, Monitoring Service, Librarian, etc).
This task may well involve a reasonable amount of change in the structure of components/containers/controllers so that the API responses can be passed to the loading page & the dashboard pages.

### Warn the user if the instance should be prepared for boot

### Cross browser issues
[IE11]
- Header: fullscreen icon
- Usage charts (too small)
- Declarative Mgmt icons
- Declarative Mgmt legend
- SVG Loader animation (Animated GIF?)

[Firefox]
- Modernizr svg/smil detection not working. Loader doesn't spin.
- Universal Memory: Enclosure labels incorrectly positioned.
- Universal Memory: Node label incorrectly positioned
- Declarative Mgmt: Deviation chart label (left most) incorrectly positioned
