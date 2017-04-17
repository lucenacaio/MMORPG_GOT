var mongo = require("mongodb");

var url = "localhost"; /* url de conexão do Servidor do BD */
var port = 27017; /** Porta de conexão */

var connMongoDB = function() {
    var db = new mongo.Db(
        'got',
        new mongo.Server(url, port, {}), {}
    );
    return db;
}

module.exports = function() {
    return connMongoDB;
}