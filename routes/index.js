const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const ratingController = require('../controllers/evalController')
const commentController = require('../controllers/commentController')

router.get('/restaurants/:name?/:cuisine?/:lat?/:lng?/:distance?/:order?', restaurantController.getRestaurantsByFilters);
router.get('/restaurants', restaurantController.getAllRestaurants);
router.get('/restaurants/:id', restaurantController.getRestaurantById);
router.delete('/restaurants/:id', restaurantController.deleteRestaurantById);
router.post('/restaurants', restaurantController.createRestaurant);
router.patch('/restaurants/:id', restaurantController.updateRestaurantById);
//Rutas Rating...
router.get('/restaurants/:id/ratings/', ratingController.getRatingRestaurant)
router.post('/restaurants/:id/ratings/', ratingController.postRatingRestaurant)

//Rutas Comentar
router.get('/restaurants/:id/comments/', commentController.getCommentsRestaurant)
router.post('/restaurants/:id/comments/', commentController.postCommentRestaurant) 

module.exports = router;
