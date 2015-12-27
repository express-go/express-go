# express-go #
Express-go the Node.js Express based MVC framework engine, inspirated by Laravel framework.

#### Under construction, STABLE package is expected at the end of December 2015. ####

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Linux Build][travis-image]][travis-url]
[![Windows Build][appveyor-image]][appveyor-url]
[![Dependency Status][deps-image]][deps-url]
[![devDependency Status][devs-image]][devs-url]

### Example project ###
Please, see [express-go-project](https://github.com/express-go/express-go-project/) page for sample usage.

### Installation ###
```
$ npm install express-go --save
```

### Supported features ###
* *Automatic cluster restart when project files are changed [beta]*
* [Clusters and workers](https://nodejs.org/api/cluster.html)
* Command-line interface
* [Google Analytics](https://www.npmjs.com/package/nodalytics)
* [Google SPDY](https://www.npmjs.com/package/spdy)
* Module support
    * MVC file structure
    * module-go.json file
    * Loading from npm vendors (node_modules) directory
* [Socket.io](https://www.npmjs.com/package/socket.io)
    * [Binary transfers](https://www.npmjs.com/package/socket.io-stream)
    * [Redis support](https://www.npmjs.com/package/socket.io-redis)
    * [Shared sessions between workers and application](https://www.npmjs.com/package/socket.io.session)
* TypeScript source files
* TypeScript test files *[in progress]*

### MVC support ###
* Commands
    * *~~Extending CLI commands~~ [future feature]*
* Configurations
* Controllers
    * *~~Listing controllers in CLI~~ [future feature]*
* Loaders
    * Declaring custom services and file types
    * Ex.: module.exports.foo = {}
* Middlewares
    * *~~Listing middlewares in CLI~~ [future feature]*
* *Models [beta]*
    * *~~Listing models in CLI~~ [future feature]*
    * [ORM based library](https://www.npmjs.com/package/sequelize)
    * Multiple drivers (PostgreSQL, MySQL, MariaDB, SQLite, MSSQL, ...)
* Routes
    * Listing routes in CLI
    * [Named routing](https://www.npmjs.com/package/named-routes)
    * REST Resource controller
    * *~~Auto resource controller~~ [future feature]*
* Sockets
    * *~~Listing sockets in CLI~~ [future feature]*
    * Use a text transmission
    * Prefixed channels
        * index.js => wss://localhost/
        * foo.js   => wss://localhost/foo
* Streams
    * *~~Listing streams in CLI~~ [future feature]*
    * Use a binary transmission
    * Prefixed channels
        * index.js => wss://localhost/
        * foo.js   => wss://localhost/foo
* [Translations](https://www.npmjs.com/package/i18next)
    * *~~Listing translations in CLI~~ [future feature]*
    * Namespace language files
    * *~~Redis cache~~ [future feature]*
* Views
    * [Multiple template engine support](https://www.npmjs.com/package/consolidate)
    * *~~Redis cache~~ [future feature]*

### Security support ###
* [CSRF verification](https://www.npmjs.com/package/csurf)
* [DDOS prevention](https://www.npmjs.com/package/ddos)
* [HELMET package](https://www.npmjs.com/package/helmet)

### Roadmap ###
* STABLE support
* Migrations
* Seeders
* Providers (similar Loaders)

## License

  [GNU](LICENSE)

[npm-image]: https://img.shields.io/npm/v/express-go.svg
[npm-url]: https://npmjs.org/package/express-go
[downloads-image]: https://img.shields.io/npm/dm/express-go.svg
[downloads-url]: https://npmjs.org/package/express-go
[travis-image]: https://img.shields.io/travis/express-go/express-go/master.svg?label=linux
[travis-url]: https://travis-ci.org/express-go/express-go
[appveyor-image]: https://img.shields.io/appveyor/ci/sipimokus/express-go/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/sipimokus/express-go
[deps-image]: https://img.shields.io/david/express-go/express-go.svg?label=deps
[deps-url]: https://david-dm.org/express-go/express-go
[devs-image]: https://img.shields.io/david/dev/express-go/express-go.svg?label=devDeps
[devs-url]: https://david-dm.org/express-go/express-go#info=devDependencies