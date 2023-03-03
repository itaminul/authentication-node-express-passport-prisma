/* eslint-disable import/prefer-default-export */
const passport = require('passport');
const { user } = require('../../prisma/dbConnection');
// const { Strategy, ExtractJwt } = require('passport-jwt');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var Strategy = require('passport-local').Strategy;
//import { config, underscoreId } from './config';
const prisma = require('../../prisma/dbConnection')

 const applyPassportStrategy = passport => {
  
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

  options.secretOrKey = process.env.SC_TOKEN;
  // console.log("options", options)
  passport.use(
    new JwtStrategy(options, (payload, done) => {
      console.log("passport dd", process.env.SC_TOKEN)
      user.findMany({ where: {email: payload.email} }, (err, user) => {
        console.log("pppp", payload.email)
        if (err) return done(err, false);
        if (user) {
          return done(null, {
            email: user.email,
            //id: user[underscoreId]
          });
        }
        console.log("pppp")
        return done(null, false);
      });
    })
  );
};

module.exports = applyPassportStrategy