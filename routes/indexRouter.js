const express = require('express');
const router = express.Router(); 
const serviceController = require('../controllers/serviceController');
const bookingController = require('../controllers/bookingController');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/services', serviceController.getAllServices);
router.get('/services/new', serviceController.getNewServiceForm);
router.post('/services', serviceController.createService);
router.get('/services/:id', serviceController.getServiceDetail);
router.get('/services/:id/edit', serviceController.getEditServiceForm);
router.post('/services/:id', serviceController.updateService);

router.get('/bookings', bookingController.getAllBookings);
router.get('/bookings/new', bookingController.getNewBookingForm);
router.post('/bookings', bookingController.createBooking);

module.exports = router;