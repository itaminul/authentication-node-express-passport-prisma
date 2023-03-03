const prisma = require('../../prisma/dbConnection')
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

// const User = require('../models/user');
const passport = require('passport')
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SC_TOKEN
};

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {

                try {
                   prisma.user.findFirst({
                        where: {
                            email: jwt_payload.email
                        },
                    }).then(user => {
                        if (user) {
                        // console.log('user found in db in passport');
                        done(null, user);
                        } else {
                        // console.log('user not found in db');
                        done(null, false);
                        }
                    });
                    } catch (err) {
                    done(err);
    }
            /*
            // console.log("payload", jwt_payload)
            prisma.user.findFirst({ where: {email: jwt_payload.email} })
                .then(user => {
                    if (user) return done(null, user);
                    return done(null, false);
                })
                .catch(err => {
                    return done(err, false, {message: 'Server Error'});
                });
                */


        })
    );
};