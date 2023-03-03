const express = require('express')
const passport = require('passport')
const router = express.Router()
const authCheck = require('../middleware/Authenticate')
const jwtAuth = require('../middleware/Jwt')
const {getAll, create} = require('../controller/CategroyController')
router.route('/').get(authCheck, getAll)
router.route('/').post(authCheck, create)
module.exports = router