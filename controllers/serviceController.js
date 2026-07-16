const { validationResult } = require('express-validator');
const pool = require('../db/db');

exports.getAllServices = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM services');
        const services = result.rows;
        res.render('service_list', { services });
    } catch (error) {
        console.error('Error fetching services: ', error);
        res.status(500).send('Error fetching services');
    }
};

exports.getServiceDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM services WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).send('Service not found');
        }
        
        const service = result.rows[0];
        res.render('service-detail', { service });
    } catch (error) {
        console.error('Error fetching service', error);
        res.status(500).send('Error fetching service')
        
    }
}

exports.getNewServiceForm = (req, res) => {
    res.render('service_form', { service: null, errors: [ ]});
};

exports.createService = [
    body('name').trim().notEmpty().withMessage('Service name required')
    .isLength({ max: 255 }).withMessage('Service name must be less than 255 characters'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('duration_minutes').isInt({ min: 1 }).withMessage('Duration must be a positive number'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a valid number'),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render('service_form', {
                service: req.body,
                errors: errors.array()
            });
        }
        try {
            const { name, description, duration_minutes, price } = req.body;
            await pool.query(
                'INSERT INTO services (name, description, duration_minutes, price) VALUES ($1, $2, $3, $4)',
                [name, description, duration_minutes, price]
            );
            res.redirect('/services');
        } catch (error) {
            console.error('Error creating service: ', error);
            res.status(500).send('Error creating service');
            
        }
    }
];

exports.getEditServiceForm = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM services WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(400).send('Service not found');
        }

        const service = result.rows[0];
        res.render('service_form', { service, errors: [] });
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).send('Error fetching service');
    }
};


exports.updateService = [
    body('name').trim().notEmpty().withMessage('Service name required')
    .isLength({ max: 255 }).withMessage('Service name must be less than 255 characters'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('duration_minutes').isInt({ min: 1 }).withMessage('Duration must be a positive number'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a valid number'),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const { id } = req.params;
            const service = { id, ...req.body };

            return res.render('service_form', {
                service,
                errors: errors.array()
            });
        }

        try {
            const { id } = req.params;
            const { name, description, duration_minutes, price } = req.body;

            await pool.query(
                'UPDATE services SET name = $1, description = $2, duration_minutes = $3, price = $4 WHERE id = $5',
                [name, description, duration_minutes, price, id]
            );
            res.redirect(`/services/${id}`);
        } catch (error) {
            console.error('Error updating service:', error);
            res.status(500).send('Error updating service');
            
        }
    }

]