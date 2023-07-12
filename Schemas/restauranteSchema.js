const mongoose = require('mongoose');

// Definir el esquema del restaurante
const restauranteSchema = new mongoose.Schema({
    address: {
      building: { type: String, required: true },
      coord: { type: [Number], required: true },
      street: { type: String, required: true },
      zipcode: { type: String, required: true }
    },
    borough: { type: String, required: true },
    cuisine: { type: String, required: true },
    grades: { type: Array, default: [] },
    name: { type: String, required: true },
    restaurant_id: { type: String, required: true }
  });
  
  // Crear el modelo Restaurante basado en el esquema
  const Restaurante = mongoose.model('Restaurante', restauranteSchema);
  
  module.exports = Restaurante;