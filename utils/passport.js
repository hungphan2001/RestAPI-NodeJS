const express = require("express");
const app = express();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const Passport = ()=>{
    
    passport.serializeUser((user, done) => {
      done(null, user);
    });
    
    passport.deserializeUser((user, done) => {
      done(null, user);
    });
    
    passport.use(new GoogleStrategy({
      clientID: '447376150330-e5880dvmom92fehshl7p2um2t0hhum6e.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['profile', 'email']
      
    }, (accessToken, refreshToken, profile, done) => {
      // Save the access token, refresh token, and user profile as needed
      // Call the `done` callback with the user object
      return done(null, profile);
    }));
}

module.exports= Passport;