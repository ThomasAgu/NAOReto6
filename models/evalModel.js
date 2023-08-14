const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('../db')
const mongoose = require('mongoose')

const evalModel = {
    actualizarRestaurante: async (id, updates) => {
        db = getDb() 
        try {
          if (ObjectId.isValid(id)) {
            const result = await db.collection('restaurants').updateOne(
              { _id: new mongoose.Types.ObjectId(id) },
              { $push: { grades: updates } }
            );
            return result;
          } else {
            throw new Error('El id es inválido');
          }
        } catch (error) {
          throw error;
        }
      }
}

module.exports = evalModel;