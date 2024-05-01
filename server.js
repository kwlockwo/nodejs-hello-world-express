import express from 'express';
import pino from 'pino';

const PORT = process.env.PORT || 5001;
const DEFAULT_NAME = 'World';
const LOGGER = pino();

const app = express();

app.set('view engine', 'pug');

// Middleware to set name
app.use((req, res, next) => {
    let name = DEFAULT_NAME;
    if(req.query.name) {
        name = req.query.name;
    }
    req.name = name;
    LOGGER.info(`Name: ${name}`);
    next();
});

// Handle root route
app.get('/', (req, res) => {
    switch(req.accepts(['html', 'json'])) {
        case 'json':
            LOGGER.error('Handle JSON request')
            res.json({hello: req.name});
            break;
        case 'html':
            LOGGER.error('Handle HTML request')
            res.render('index', {title: 'Hello', message: `Hello ${req.name}!`})
            break;
        default:
            LOGGER.error('Bad request not JSON or HTML');
            res.status(400).send('400 (Bad Request)');
    };
});

// All other routes are bad
app.route('*').all((req, res) => {
    switch(req.accepts(['html', 'json'])) {
        case 'json':
            LOGGER.error('Bad JSON request');
            res.status(400).json({message: '400 (Bad Request)'});
            break;
        case 'html':
            LOGGER.error('Bad HTML request');
            res.status(400).render('error', {title: 'Bad Request', message: '400 (Bad Request)'});
            break;
        default:
            LOGGER.error('Bad OTHER request');
            res.status(400).send('400 (Bad Request)');
    };
    res.end();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
