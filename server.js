
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.use((err, req, res, next) =>{
    console.error(err);
    res.status(500).render('error', { error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    
});