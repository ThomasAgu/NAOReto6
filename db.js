const { MongoClient } = require('mongodb')

let dbConnection;


//Crear la base de datros en el docker
module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect('mongodb://root:example@mongo:27017/')
            .then((client) => {
                dbConnection = client.db()
                return cb()
            })
            .catch( err => {
                console.log(err)
                return cb(err)
            })
    },
    getDb: () => dbConnection
}