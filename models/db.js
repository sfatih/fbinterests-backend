var MongoClient = require('mongodb').MongoClient;
// Config file for DB connections

function DB() {
    this.db = null; // The MongoDB database connection variable
}

DB.prototype.connect = function (uri) {

    var _this = this;
    return new Promise(function (resolve, reject) {
        if (_this.db) {
            // Already connected
            resolve();
        } else {
            var __this = _this;
            //MongoDB driver promise
            MongoClient.connect(uri)
                .then(
                    function (database) {
                        // Store the database connection as part of the DB object
                        __this.db = database;
                        console.log('Connection is okay');
                        resolve();
                    },
                    function (err) {
                        console.log("Error connecting: " + err.message);

                        // Retrun error
                        reject(err.message);
                    }
                )
        }
    })
}

DB.prototype.close = function () {

    // Closes the database connection. 
    if (this.db) {
        console.log(this.db);
        this.db.close()
            .then(
                // Succes condition
                function () {},
                function (error) {
                    console.log("Failed to close the database: " + error.message)
                }
            )
    }
}

DB.prototype.addDocument = function (coll, document) {

    // Inserts the data comes from the client to collections

    var _this = this;

    return new Promise(function (resolve, reject) {
        _this.db.db("fb-interests").collection(coll, function (error, collection) {
            if (error) {
                console.log("Could not access collection: " + error.message);
                reject(error.message);
            } else {
                collection.insertOne(document)
                    .then(
                        function (result) {
                            resolve();
                        },
                        function (err) {
                            console.log("Insert failed: " + err.message);
                            reject(err.message);
                        }
                    )
            }
        })
    })
}

DB.prototype.findUser = function (val) {

    // Returns a document that filtered from the collection with
    // query operations

    var _this = this;

    return new Promise(function (resolve, reject) {
        _this.db.db("fb-interests").collection("user", function (error, collection) {
            if (error) {
                console.log("Could not access collection: " + error.message);
                reject(error.message);
            } else {
                console.log(val);
                var res = collection.findOne({
                    "email": val
                });

                resolve(res);

            }
        })
    })
}

DB.prototype.findCategories = function (val) {

    // Returns a document that filtered from the collection with
    // query operations

    var _this = this;

    return new Promise(function (resolve, reject) {
        _this.db.db("fb-interests").collection("categories", function (error, collection) {
            if (error) {
                console.log("Could not access collection: " + error.message);
                reject(error.message);
            } else {
                var doc = collection.findOne({
                    "email": {
                        val
                    }
                });

                resolve(doc);

            }
        })
    })
}

module.exports = DB;