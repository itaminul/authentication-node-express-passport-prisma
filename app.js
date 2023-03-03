const express = require('express')
const dotenv = require('dotenv')
const session = require('express-session')
const ErrorHandler = require("./src/middleware/ErrorHandler")
const app = express();
const authRouter = require('./src/route/AuthRoutes');
const applyPassportStrategy = require('./src/store/passport')
const passport = require('passport');
const prisma = require('./prisma/dbConnection');
const  authenticatea  = require('./src/middleware/Authenticate');
const indexRoute = require('./src/route/IndexRoute')

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 5000
applyPassportStrategy(passport)
app.use(express.urlencoded({ extended: false}))
app.use(express.json()); //for handling json data

require('./src/config/passport')

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

app.use(passport.initialize())
app.use(passport.session())
// require('./src/store/passport')
require('./src/middleware/Jwt')(passport)


app.get('/hel',authenticatea,
  async(req, res) => {
    const newUser = await prisma.user.findMany();
    res.json({ success: true, "message": "show successfully", newUser})
  }
);

const categoryRoute = require('./src/route/CategoryRoues')
app.use('/api/auth', authRouter)
app.use('/api/category', categoryRoute)

app.use(ErrorHandler)
app.listen(port, () => {
console.log(`Server running on port ${port}`);
});

