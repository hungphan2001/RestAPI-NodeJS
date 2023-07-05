const express = require("express");
const dbConnect = require("./config/dbConnect");
const Passport = require('./utils/passport');
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoutes");
const productRouter = require("./routes/productRoutes");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const morgan = require("morgan");
const slugify = require("slugify");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
dbConnect();
Passport();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());

app.use(session({
    secret: 'cats',
    resave: false,
    saveUninitialized: false
  }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user',authRouter);
app.use('/api/product',productRouter);
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect or return response as desired
    res.redirect('/profile');
  }
);

app.get('/profile', (req, res) => {
  // Access the authenticated user's profile from `req.user`
  res.send(req.user);
});
app.use(notFound);

app.use(errorHandler);


app.listen(PORT,()=>{
    console.log(`Server is running PORT ${PORT}`);
})