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