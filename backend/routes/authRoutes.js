let express = require('express');
let dotenv = require('dotenv');
let passport = require('passport');
let {
    register,
    login,
    googleAuthCallback,
    getMe,
    updateProfile,
    logout,

}= require('../controllers/authController');
const { protect } = require('../utils/authUtils');

dotenv.config();

let router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/google',passport.authenticate('google',{scope:['profile','email']}));
// router.get('/google/callback',passport.authenticate('google',{
//     failureRedirect: `${process.env.CLIENT_URL}/login`,
//     session: false,
// }),googleAuthCallback);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: false,
  }),
  googleAuthCallback
);

router.get('/me',protect,getMe);
router.put('/update-profile',protect,updateProfile);
router.post('/logout',protect,logout);

module.exports = router;