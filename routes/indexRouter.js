const express = require('express');
const router = express.Router(); 
const serviceController = require('../controllers/serviceController');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/services', serviceController.getAllServices);
router.get('/services/:id', serviceController.getServiceDetail);

module.exports = router;