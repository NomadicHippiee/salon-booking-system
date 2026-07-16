const pool = require('../db/db');
const { body, validationResult } = require('express-validator');

exports.getAllBookings = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT b.id, b.customer_name, b.customer_email, b.booking_date, b.start_time, b.status, s.name as service_name, st.name as stylist_name FROM
            bookings b JOIN services s ON b.service_id = s.id JOIN 
            stylists st ON b.stylist_id = st.id ORDER BY b.booking_date DESC
            `);
        const bookings = result.rows;
        res.render('booking_list', { bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).send('Error fetching bookings');
        
    }
};

exports.getNewBookingForm = async (req, res) => {
    try {
        const stylistsResult = await pool.query('SELECT id, name FROM stylists ORDER BY name');
        const servicesResult = await pool.query('SELECT id, name FROM services ORDER BY name');

        const stylists = stylistsResult.rows;
        const services = servicesResult.rows;
        const preSelectedServiceId = req.query.service_id || null;

        res.render('booking_form', {stylists, services, preSelectedServiceId, errors: [] });
    } catch (error) {
        console.error('Error loading booking form: ', error);
        res.status(500).send('Error loading booking form');
        
    }
};

exports.createBooking = [
    body('customer_name').trim().notEmpty().withMessage('Customer name is required')
    .isLength({ max: 50}).withMessage('Name must be less than 50 characters'),
    body('customer_email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email adress'),
    body('customer_phone').optional({ checkFalsy: true }).isMobilePhone('any', {strictMode: true}).blacklist(' ()\\-').withMessage('Phone number must include country code'),
    body('stylist_id').isInt().withMessage('Please select a stylist'),
    body('service_id').isInt().withMessage('Please select a service'),
    body('booking_date').notEmpty().withMessage('Booking date is required').isISO8601().withMessage('Invalid date'),
    body('start_time').notEmpty().withMessage('Start time is required').matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/).withMessage('Invalid time format'),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const stylistsResult = await pool.query('SELECT id, name FROM stylists ORDER BY name');
            const servicesResult = await pool.query('SELECT id, name FROM services ORDER BY name');

            return res.render('booking_form', {
                stylists: stylistsResult.rows,
                services: servicesResult.rows,
                preSelectedServiceId: req.body.service_id,
                errors: errors.array()
            });
        }

        try {
            const { customer_name, customer_email, customer_phone, stylist_id, service_id, booking_date, start_time } = req.body;

            const checkConflict = await pool.query(
                'SELECT id FROM bookings WHERE stylist_id = $1 AND booking_date = $2 AND start_time = $3', [stylist_id, booking_date, start_time]
            );

            if (checkConflict.rows.length > 0) {
                const stylistsResult = await pool.query('SELECT id, name FROM stylists ORDER BY name');
                const servicesResult = await pool.query('SELECT id, name FROM services ORDER BY name');

                return res.render('booking_form', {
                    stylists: stylistsResult.rows,
                    services: servicesResult.rows,
                    preSelectedServiceId: service_id,
                    errors: [{ msg: 'This time slot is already booked. Choose another time.'}]
                });
            }
            await pool.query('INSERT INTO bookings (customer_name, customer_email, customer_phone, stylist_id, service_id, booking_date, start_time, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                [customer_name, customer_email || null, customer_phone || null, stylist_id, service_id, booking_date, start_time, 'pending']
            );
            res.redirect('/bookings');
        } catch (error) {
            console.error('Error creating booking:', error);
            res.status(500).send('Error creating booking');

            
        }
    }
];

exports.getDeleteBookingForm = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT b.id, 
            b.customer_name,
            b.booking_date,
            b.start_time,
            s.name as service_name,
            st.name as stylist_name 
            FROM bookings b JOIN services s ON b.service_id = s.id
            JOIN stylists st ON b.stylist_id = st.id WHERE b.id = $1
            `, [id]);

            if (result.rowCount.length === 0) {
                return res.status(404).send('Booking not found');
            }

            const booking = result.rows[0];
            res.render('booking_delete', { booking, error: null });
        } catch (error) {
            console.error('Error fetching booking:', error);
            res.status(500).send('Error fetching booking');
        }
    };

exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminPassword } = req.body;

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      const booking = await pool.query(`
        SELECT 
          b.id, 
          b.customer_name, 
          b.booking_date,
          b.start_time,
          s.name as service_name,
          st.name as stylist_name
        FROM bookings b
        JOIN services s ON b.service_id = s.id
        JOIN stylists st ON b.stylist_id = st.id
        WHERE b.id = $1
      `, [id]);
      
      return res.render('booking_delete', {
        booking: booking.rows[0],
        error: 'Incorrect admin password'
      });
    }
    
    await pool.query('DELETE FROM bookings WHERE id = $1', [id]);
    res.redirect('/bookings');
} catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).send('Error deleting booking');
  }
};