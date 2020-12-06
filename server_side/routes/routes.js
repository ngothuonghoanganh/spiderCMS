const express = require('express');

const router = express.Router();
const indexRouter = require('../routes/index');
const apiRouter = require('../routes/api');

router.use('/', indexRouter);
router.use('/api', apiRouter);

// router.use('/users', usersRouter);

module.exports = router;