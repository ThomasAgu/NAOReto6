const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const ratingController = require('../controllers/evalController')
const commentController = require('../controllers/commentController')

router.get('/restaurants/search', restaurantController.getRestaurantsByFilters);
router.get('/restaurants', restaurantController.getAllRestaurants);
router.get('/restaurants/:id', restaurantController.getRestaurantById);
router.delete('/restaurants/:id', restaurantController.deleteRestaurantById);
router.post('/restaurants', restaurantController.createRestaurant);
router.patch('/restaurants/:id', restaurantController.updateRestaurantById);
//Rutas Rating...
router.get('/restaurants/ratings/:id', ratingController.getRatingRestaurant)
router.post('/restaurants/ratings/:id', ratingController.postRatingRestaurant)

//Rutas Comentar
router.get('/restaurants/comments/:id', commentController.getCommentsRestaurant)
router.post('/restaurants/comments/:id', commentController.postCommentRestaurant) 

module.exports = router;
