//DESTROCTER THE ROUTER FROM THE EEXPRESS PACKAGE
const {Router } = require('express');
const authController = require('../controllers/authController');


//creat new instance of the router 
const router =Router();

router.get('/signup',authController.signup_get);
router.get('/login',authController.login_get);

router.post('/signup',authController.signup_post);

router.post('/login',authController.login_post);

router.get('/logout',authController.logout_get);



//exported routes 
module.exports = router;
