let express = require('express');
let connectDB = require('./config/database');
let cors = require('cors');
let helmet = require('helmet');
let morgan = require('morgan');
let compression = require('compression');
let cookieParser = require('cookie-parser');
let dotenv = require('dotenv');
let passport = require('./config/passport');
let session = require('express-session');
let errorHandler = require('./middleware/errorMiddleware');
let authRoutes = require('./routes/authRoutes');
let publicationRoutes = require('./routes/publicationRoutes');
let trialRoutes = require('./routes/trialRoutes');
let forumRoutes = require('./routes/forumRoutes')


dotenv.config();
connectDB();

let app = express();

// Middleware
// app.use(cors({ origin: true, credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(cors(
  {
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
  
));
app.use(express.json());
app.use(session({    secret: process.env.JWT_SECRET, // Use a strong secret from your .env file
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 } // 1 day
  }));
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  }))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());

// Session for Passport
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/trials', trialRoutes)
app.use('/api/forum',forumRoutes)



// Error Handler
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
