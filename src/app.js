const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views'); // customize views directory
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Sila Kucuknane'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Sila Kucuknane'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helplful text',
        title: 'Help',
        name: 'Sila Kucuknane'
    })
});

app.get('', (req, res) => {
    res.send('<h1>Weather</h1>');
});

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        });
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if(error) {
            return res.send({ error: error });
        }

        forecast(longitude, latitude, (error, forecastData) => {
            if(error) {
                return res.send({ error });
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            });
        });
    });
    
    // res.send({
    //     location: 'New York',
    //     forecast: 'Cloudy',
    //     address: req.query.address
    // });
})

app.get('/pr')

app.get('/help/*', (req,res) => {
    res.render('404', {
        message: 'Help article not found',
        title: '404',
        name: 'Sila Kucuknane'
    });
});

// * means everything else not listed
app.get('*', (req, res) => {
    res.render('404', {
        message: 'Page not found',
        title: '404',
        name: 'Sila Kucuknane'
    });
})

app.listen(3000, () => {
    console.log('Server is up on 3000.')
});