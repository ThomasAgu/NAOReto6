const restauranteModel = require('../models/restaurantModel');
const { ObjectId } = require('mongodb');
const evalModel = require('../models/evalModel');

const evalController = { 

    getRatingRestaurant: async (req, res) => {
        const id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }
        try {
            const result = await restauranteModel.getRestaurantById(id);
            res.status(200).json(result.grades);
        }
        catch(error){res.status(500).json({ error: "Error en buscar los ratings del restaurante" });}
    },

    postRatingRestaurant: async (req, res) => {
        const id = req.params.id;
        const updates = req.body;
        try{
            const result = await evalModel.actualizarRestaurante(id, updates);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: "No se puede actualizar el restaurante" });
        }
    },
}

module.exports = evalController;