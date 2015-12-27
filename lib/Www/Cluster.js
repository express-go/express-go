///<reference path='../../typings/tsd.d.ts'/>
var cluster = require('cluster');
var watch = require('node-watch');
var debug = require('debug')('express-go:Www.Cluster');
var Www;
(function (Www) {
    var Cluster = (function () {
        function Cluster(app) {
            debug("Initializing");
            this.app = app;
        }
        Cluster.prototype.createCluster = function (callFunction) {
            debug("Create Cluster");
            // Master cluster
            if (cluster.isMaster) {
                /**
                 * Fork process.
                 */
                debug('start cluster with %s workers', process.env.WORKERS);
                for (var i = 0; i < process.env.WORKERS; i++) {
                    var worker = cluster.fork();
                    debug('worker %s started.', worker.process.pid);
                }
                /**
                 * Restart process.
                 */
                cluster.on('death', function (worker) {
                    debug('worker %s died. restart...', worker.process.pid);
                    cluster.fork();
                });
                // Go through all workers
                function eachWorker(callback) {
                    for (var id in cluster.workers) {
                        callback(cluster.workers[id]);
                    }
                }
                function restartWorkers() {
                    debug("Workers restart");
                    eachWorker(function (worker) {
                        worker.kill();
                        cluster.fork();
                    });
                }
                // TODO
                // Any file change
                var timeOut;
                var filter = function (pattern, fn) {
                    return function (filename) {
                        if (pattern.test(filename)) {
                            fn(filename);
                        }
                    };
                };
                watch(global.app_path(), filter(/\.js$|\.ts$/, function (file) {
                    if (file) {
                        clearTimeout(timeOut);
                        var fileExt = file.substr(file.lastIndexOf('.') + 1);
                        if (fileExt !== "js" && fileExt !== "ts")
                            return;
                        debug(" filename provided: " + file);
                        timeOut = setTimeout(restartWorkers, 2300);
                    }
                }));
            }
            else {
                /**
                 * Model sync
                 * http://docs.sequelizejs.com/en/1.7.0/articles/heroku/
                 */
                this.app.sequelize.sync().then(function () {
                    /**
                     * Create HTTP server.
                     */
                    callFunction();
                });
                debug("Worker %d running!", cluster.worker.id);
            }
        };
        return Cluster;
    })();
    Www.Cluster = Cluster;
})(Www = exports.Www || (exports.Www = {}));
