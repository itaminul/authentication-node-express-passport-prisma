const express = require('express')
const passport = require('passport')
const router = express.Router()
const authCheck = require('../middleware/Authenticate')
const jwtAuth = require('../middleware/Jwt')
const {getAll, create} = require('../controller/ProductController')
router.route('/').get(getAll)
router.route('/').post(create)
module.exports = router