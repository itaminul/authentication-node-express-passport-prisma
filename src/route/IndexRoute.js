const express = require('express')
const router = express.Router()
const authRoutes = require('./AuthRoutes')
const category = require('./CategoryRoues')
router.route('/auth', authRoutes)
router.route('/category',category)
module.exports= router