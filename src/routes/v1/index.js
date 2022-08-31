const express = require('express');
const authRoute = require('../../api/auth/auth.route');


const router = express.Router();

router.use('/auth', authRoute);


module.exports = router;
