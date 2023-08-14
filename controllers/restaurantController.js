const restauranteModel = require('../models/restaurantModel');
const { ObjectId } = require('mongodb');
const con = require('../db')

const restaurantController = {
   
    getAllRestaurants: async (req, res) => {
      try {
        const restaurants = await restauranteModel.getAllRestaurants();
        res.status(200).json(restaurants);
      } catch (error) {
        res.status(500).json({ error: "Error en buscar los restaurantes" });
      }
    },

    getRestaurantById: async (req, res) => {
      const id= req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      try {
        const restaurants = await restauranteModel.getRestaurantById(id);
        res.status(200).json(restaurants);
      }
      catch (error) {
        return res.status(500).json({ error: "No se pudo borrar el restaurante" });
      }

    },

    deleteRestaurantById: async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }
  
      try {
        const result = await restauranteModel.deleteById(id);
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Restaurante no encontrado" });
        }
        return res.status(200).json(result);
      } catch (error) {
        return res.status(500).json({ error: "No se pudo borrar el restaurante" });
      }
    },

    createRestaurant: async (req, res) => {
      const nuevoRestaurante = req.body;
      try {
        const result = await restauranteModel.create(nuevoRestaurante);
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ error: "No se pudo crear el restaurante" });
      }
    },

    updateRestaurantById: async (req, res) => {
      const id = req.params.id;
      const updates = req.body;
  
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }
  
      try {
        const result = await restauranteModel.updateById(id, updates);
        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: "Restaurante no encontrado" });
        }
        return res.status(200).json(result);
      } catch (error) {
        return res.status(500).json({ error: "No se puede actualizar el restaurante" });
      }
    },

    getRestaurantsByFilters: async (req, res) => {
      const filters = {
        lat: req.body.lat || '',
        lng: req.body.lng || '',
        cuisine: new RegExp('^' + (req.body.cuisine || ''), 'i'),
        name: new RegExp('^' + (req.body.name || ''), 'i'),
        distance: req.body.distance || 5000,
        order: req.body.order || 1
      };
      try {
        const restaurants = await restauranteModel.getRestaurantsByFilters(filters);
        res.status(200).json(restaurants);
      } catch (error) {
        res.status(500).json({ error: "No se pudieron obtener los restaurantes" });
      }
    },
  };
  
  module.exports = restaurantController;