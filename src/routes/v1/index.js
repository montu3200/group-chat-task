const express = require('express');
const apiDocsRoute = require('./api-docs.route');
const authRoute = require('../../api/auth/auth.route');
// const customerRouter = require('../../api/customer/customer.route')


const router = express.Router();

router.use('/api-docs', apiDocsRoute)
router.use('/auth', authRoute);


module.exports = router;
