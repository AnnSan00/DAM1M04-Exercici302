const express = require('express');
const fs = require('fs');
const path = require('path');
const hbs = require('hbs');

const app = express();
const port = 3000;

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Disable cache
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// Handlebars
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Registrar partials
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Helpers
hbs.registerHelper('lte', (a, b) => a <= b);

// RUTA PRINCIPAL /
app.get('/', (req, res) => {
  const file = path.join(__dirname, 'data', 'site.json');
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  res.render('index', json);
});

// RUTA INFORME /informe
app.get('/informe', (req, res) => {
  const site = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'site.json'), 'utf8'));
  const cities = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'cities.json'), 'utf8'));
  const countries = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'countries.json'), 'utf8'));

  res.render('informe', {
    title: site.title,
    subtitle: site.subtitle,
    cities: cities.cities,
    countries: countries.countries,
    threshold: 800000
  });
});

// Start server
const httpServer = app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  httpServer.close();
  process.exit(0);
});
