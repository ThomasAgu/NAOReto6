const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('../db')

let db 



const restauranteModel = {
    getAllRestaurants: async () => {
      db = getDb() //este anda el resto no 
      const restaurants = await db.collection('restaurants')
        .find()
        .sort({ name: 1 })
        .toArray();
      return restaurants;
    },

    create: async (restauranteData) => {
      db = getDb()
      try {
        const result = await db.collection('restaurants').insertOne(restauranteData);
        return result;
        }
        catch (error) {
          throw error;
        }
      },

    updateById: async (id, updates) => {
      db = getDb()
      try {
        const objectId = new ObjectId(id);
        const result = await db.collection('restaurants').updateOne({ _id: objectId }, { $set: updates });
        return result;
      } catch (error) {
        throw error;
      }
    },

    getRestaurantById: async (id) => {
      db = getDb()
      try{
        const objectId = new ObjectId(id);
        const result = await db.collection('restaurants').findOne({ _id: new ObjectId(id)})
        return result
      }
      catch(error){
        throw error;
      }
    },

    getRestaurantsByFilters: async (filters) => {
      db = getDb()
      try {
        const restaurants = await db.collection('restaurants')
          .find({
            "cuisine": { $regex: filters.cuisine },
            "name": { $regex: filters.name },
            "address.coord": {
              $near: {
                $geometry: {
                  type: "Point",
                  coordinates: [filters.lat, filters.lng]
                },
                $maxDistance: filters.distance
              }
            }
          })
          .sort({
            "address.coord": filters.order
          })
          .toArray();
        return restaurants;
      } catch (error) {
        throw error;
      }
    },

    deleteById: async (id) => {
      db = getDb()
      try {
        const objectId = new ObjectId(id);
        const result = await db.collection('restaurants').deleteOne({ _id: objectId });
        return result;
      } catch (error) {
        throw error;
      }
    },
  };
  
  module.exports = restauranteModel;