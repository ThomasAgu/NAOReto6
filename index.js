const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const routes = require('./routes')
//
const { connectToDb, getDb } = require('./db')

//db connection
let db

connectToDb((err) => {
    if (!err) {
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
          })
        db = getDb()
    }
})

//Body parser middleware
app.use(bodyParser.json()); // Para procesar solicitudes con formato JSON
app.use(bodyParser.urlencoded({ extended: true })); // Para procesar solicitudes con datos de formulario
//routes
app.use(routes)





