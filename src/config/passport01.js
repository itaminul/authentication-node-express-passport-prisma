const prisma = require('../../prisma/dbConnection')
//Import Express
const express = require('express')

//Import the main Passport and Express-Session library
const passport = require('passport')
const session = require('express-session')
//Import the secondary "Strategy" library
const LocalStrategy = require('passport-local').Strategy
const customeFileds = {
    usernameField: 'abc',
    passordField: 'pw'
}

const verifyCallback = (username, password, done) => {

    prisma.user.findUnique({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      });

}
const strategy = new LocalStrategy(customeFileds, verifyCallback)

passport.use(strategy);

passport.deserializeUser((userObj, done) => {
    done (null, userObj )
})

passport.deserializeUser((userId, done) => {
    prisma.user.findUnique(userId)
    .then((user) => {
        done (null, user )
    })
    .catch(err => done(err))   
})
