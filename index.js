const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
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
app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.get('/restaurants', (req, res) => {
    let restaurants = []

    db.collection('restaurants')
        .find()
        .sort({ name: 1 })
        .forEach(rest => restaurants.push(rest))
        .then( () => {
            res.status(200).json(restaurants)
        })
        .catch(() => {
            res.status(500).json({error: "Error en buscar los restaurantes"})
        })
})

app.get('/restaurantsPerName/', (req, res) => {
    /* Utilizamos una expresion regular para ignorar mayusculas y minusculas ademas de autocompletar */
    let restaurants = []
    //pasarlo por header
    let resName = req.body.name
    const regex = new RegExp('^' + resName, 'i')
    db.collection('restaurants')
        .find({ name : { $regex: regex}})
        .sort({ name: 1})
        .forEach(rest => restaurants.push(rest))
        .then(() => {
            res.status(200).json(restaurants)
        })
        .catch(() =>{
            res.sendStatus(500).json({error: "No hay restaurantes con ese nombre"})
        })
})


app.get('/restaurantsPerCuisine/', (req, res) => {
    /* Utilizamos una expresion regular para ignorar mayusculas y minusculas ademas de autocompletar */
    let restaurants = []
    //pasarlo por header
    let cuisineName = req.body.cuisine
    const regex = new RegExp('^' + cuisineName, 'i')
    db.collection('restaurants')
        .find({ cuisine : { $regex: regex}})
        .sort({ name: 1})
        .forEach(rest => restaurants.push(rest))
        .then(() => {
            res.status(200).json(restaurants)
        })
        .catch(() =>{
            res.sendStatus(500).json({error: "No hay restaurantes con ese tipo de comida"})
        })
})

app.get('/restaurantsPerNear', async (req, res) => {

    
    //pasar lat y lng por body
    const lat = -73.856077;
    const lng = 40.848447;
    const cuisineName = req.body.cuisine || ""
    const name = req.body.name || ""
    const regex = new RegExp('^' + cuisineName, 'i')
    const regexName = new RegExp('^' + name, 'i')
    const distance = req.body.distance || 5000
    //ORdenamiento
    const order = req.body.order || 1
    let restaurants = []
    // Coordenadas de referencia para el ordenamiento
    const referenceCoordinates = [lat, lng];
    const result = await db.collection('restaurants')
    .find({
        "cuisine" : { $regex: regex},
        "name" : { $regex : regexName},
        "address.coord": { 
            $near: { 
                $geometry: {
                    type: "Point",
                    coordinates: [lat, lng]
                },
                $maxDistance: distance
            }
        }
    }).sort({
        "address.coord" : order
    })
    .forEach(rest => restaurants.push(rest))
        .then(() => {
            res.status(200).json(restaurants)
        })
    .catch(() =>{
        res.sendStatus(500).json({error: "No hay restaurantes con ese tipo de comida"})
    })

})


//Rutas post
const Restaurante = require('./Schemas/restauranteSchema'); // Importa tu modelo Restaurante
const { ObjectId } = require('mongodb')

//alta restaurante
app.post('/restaurant', async (req, res) => { 
    const nuevoRestaurante = new Restaurante(req.body); // Create a new instance of the Restaurante model with the request body data
    console.log(nuevoRestaurante)
    db.collection('restaurants')
        .insertOne(nuevoRestaurante)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({err: err})
        })
})

//baja restaurante
const mongoose = require('mongoose');

app.delete('/restaurante/:id', (req, res) => {
    const id =new mongoose.Types.ObjectId(req.params.id)
    if (ObjectId.isValid(req.params.id)){
        db.collection('restaurants')
            .deleteOne({_id: id})
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({err: "No se pudo borrar el ristorante"})
            })
        }
        else{
            res.status(500).json({err: "El id es invalido"})
        }
})

//restaurnte update
app.patch('/restaurante/:id', (req, res) => { 
    
    const id =new mongoose.Types.ObjectId(req.params.id)
    const updates = req.body
    if (ObjectId.isValid(req.params.id)){
        db.collection('restaurants')
            .updateOne({_id: id}, {$set: updates})
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({err : "No se puede actualizar el ristorante"})
            })
        }
    else{
        res.status(500).json({err: "El id es invalido"})
    }

})

//alta rating y comentario
app.post('/evaluar/:id', (req, res) => { 

    const id =new mongoose.Types.ObjectId(req.params.id)
    const updates = req.body
    if (ObjectId.isValid(req.params.id)){
        db.collection('restaurants')
            .updateOne({_id: id}, {$push: {grades : updates}})
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({err : "No se puede actualizar el ristorante"})
            })
        }
    else{
        res.status(500).json({err: "El id es invalido"})
    }
})






