const { Router } = require('express');
const userController = require('../controllers/user_controller');
const router = Router();


const { isAuthenticated } = require('../config/passport-local-strategy');
const {User} = require('../models/user');

//GET AND POST CHANGE PASSWORD ROUTES
router.get('/changepassword',isAuthenticated,userController.get_changePassword);
router.post('/changepassword',isAuthenticated,userController.post_changePassword);


//GET LOGOUT
router.get('/logout',userController.get_logout);

module.exports = router;