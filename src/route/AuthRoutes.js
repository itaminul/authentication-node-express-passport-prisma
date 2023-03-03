const express = require('express')
const router = express.Router()
const passport = require('passport')
const authCheck = require('../middleware/Authenticate')
const {register, login} = require('../controller/AuthController')
router.route('/regis').post(register)
router.route('/login').post(authCheck,login)
module.exports = router