// let GoogleStrategy = require('passport-google-oauth20').Strategy;
// let passport = require('passport');
// let User = require('../models/User');
// let generateToken = require('../utils/authUtils');
// let dotenv = require('dotenv');

// dotenv.config();


// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL,
//         passReqToCallback: true,
//     },
//     async (req,accessToken, refreshToken, profile, done) => {
//       try {

//         const userType = req.query.userType || 'patient';
//         // Find or create user
//         let user = await User.findOne({ email: profile.emails[0].value });

//         if (!user) {
//           const randomPassword = Math.random().toString(36).slice(-8);
//           user = await User.create({
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             password: Math.random().toString(36).slice(-8), // Random dummy password
//             passwordConfirm: Math.random().toString(36).slice(-8),
//             userType: 'patient', // Default userType
//           });
//         }

//         const token = generateToken(user._id);
//         user._doc.token = token;
//         return done(null, user);
//       } catch (error) {
//         console.error(error);
//         return done(error, false);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });
// passport.deserializeUser(async (id, done) => {
//   const user = await User.findById(id);
//   done(null, user);
// });

// module.exports = passport;


let GoogleStrategy = require('passport-google-oauth20').Strategy;
let passport = require('passport');
let User = require('../models/User');
let { sendTokenResponse, generateToken } = require('../utils/authUtils');
let dotenv = require('dotenv');

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true, // ✅ Needed to access req.query
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Get userType from query parameter
        const userType = req.query.userType || 'patient'; // fallback to patient if missing

        // Find or create user
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          const randomPassword = Math.random().toString(36).slice(-8);


          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: randomPassword,
            passwordConfirm:  randomPassword,
            userType, // ✅ set dynamically
          });
        }

        const token = generateToken(user._id);
        user._doc.token = token;

        return done(null, user);
      } catch (error) {
        console.error('Google Strategy Error:', error);
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
