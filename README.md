# express-go #
Express-go the Node.js Express based MVC framework engine, inspirated by Laravel framework.

#### Under construction, LTS package is expected at the end of December 2015. ####

### Example project ###
Please, see [express-go-project](https://github.com/express-go/express-go-project/) page for sample usage.

### Supported features ###
* Command-line interface
* Core source files written in TypeScript
* Modules support
    * MVC file structure
    * module.json file
    * *~~Loading from npm vendors (node_modules) directory~~ [future feature]*
* [Clusters and workers](https://nodejs.org/api/cluster.htmlo)
* [Google Analytics](https://www.npmjs.com/package/nodalytics)
* [Google SPDY](https://www.npmjs.com/package/spdy)
* [Socket.io](https://www.npmjs.com/package/socket.io)
    * [Redis support](https://www.npmjs.com/package/socket.io-redis)
    * [Shared sessions between workers and application](https://www.npmjs.com/package/socket.io.session)
    * *~~[Binary transfers](https://www.npmjs.com/package/socket.io-stream)~~ (in progress)*
* Automatic cluster restart when project files are changed


### MVC support ###
* Controllers
* Middlewares
* Models
    * [ORM based library](https://www.npmjs.com/package/sequelize)
    * Multiple drivers (PostgreSQL, MySQL, MariaDB, SQLite, MSSQL, ...)
* Routes
    * [Named routing](https://www.npmjs.com/package/named-routes)
    * Listing routes in CLI
    * Resource controller
    * *~~Auto resource controller~~ [future feature]*
* [Translations](https://www.npmjs.com/package/i18next)
    * Namespaced language files
    * *~~Redis cache~~ [future feature]*
* Views
    * [Mulliple template engine support](https://www.npmjs.com/package/consolidate)
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