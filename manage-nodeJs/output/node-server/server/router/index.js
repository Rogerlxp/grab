const express = require('express');
const router = express.Router();

router.use('/common', require('./common'));
router.use('/user', require('./user'));
router.use('/crawlRule', require('./crawlRule'));
router.use('/crawl', require('./crawl'));
router.use('/table', require('./table'));
router.use('/contents', require('./contents'));
router.use('/distribution', require('./distribution'));
module.exports = router;