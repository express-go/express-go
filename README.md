# express-go #
Express-go the Node.js Express based MVC framework engine, inspirated by Laravel framework.

#### Under construction, STABLE package is expected at the end of December 2015. ####

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]

### Example project ###
Please, see [express-go-project](https://github.com/express-go/express-go-project/) page for sample usage.

### Installation ###
```
$ npm install express-go --save
```

### Supported features ###
* Command-line interface
* TypeScript source files
* Module support
    * MVC file structure
    * module-go.json file
    * Loading from npm vendors (node_modules) directory
* [Clusters and workers](https://nodejs.org/api/cluster.html)
* [Google Analytics](https://www.npmjs.com/package/nodalytics)
* [Google SPDY](https://www.npmjs.com/package/spdy)
* [Socket.io](https://www.npmjs.com/package/socket.io)
    * [Redis support](https://www.npmjs.com/package/socket.io-redis)
    * [Shared sessions between workers and application](https://www.npmjs.com/package/socket.io.session)
    * *~~[Binary transfers](https://www.npmjs.com/package/socket.io-stream)~~ (in progress)*
* Automatic cluster restart when project files are changed


### MVC support ###
* Commands
    * *~~Extending CLI commands~~ [future feature]*
* Configurations
* Controllers
    * *~~Listing controllers in CLI~~ [future feature]*
* Loaders / Providers
    * Declaring custom services and file types
    * Ex.: module.exports.foo = {}
* Middlewares
    * *~~Listing middlewares in CLI~~ [future feature]*
* Models
    * *~~Listing models in CLI~~ [future feature]*
    * [ORM based library](https://www.npmjs.com/package/sequelize)
    * Multiple drivers (PostgreSQL, MySQL, MariaDB, SQLite, MSSQL, ...)
* Routes
    * Listing routes in CLI
    * [Named routing](https://www.npmjs.com/package/named-routes)
    * Resource controller
    * *~~Auto resource controller~~ [future feature]*
* Sockets
    * *~~Listing sockets in CLI~~ [future feature]*
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
* [XSS filter](https://www.npmjs.com/package/xss)
* [Security package](https://www.npmjs.com/package/helmet)

### Roadmap ###
* LTS support
* GeoIP
* Migrations
* Seeders
* Configurations

## License

  [GNU](LICENSE)

[npm-image]: https://img.shields.io/npm/v/express-go.svg
[npm-url]: https://npmjs.org/package/express-go
[downloads-image]: https://img.shields.io/npm/dm/express-go.svg
[downloads-url]: https://npmjs.org/package/express-go
[travis-image]: https://img.shields.io/travis/express-go/express-go/master.svg?label=linux
[travis-url]: https://travis-ci.org/express-go/express-go
