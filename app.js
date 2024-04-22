const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const wikiRoutes = require('./routes/wikiRoutes');
const wiki = require('./model/wiki')
const errorHandler = require('./middleware/errorHandler'); 

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/wiki', wikiRoutes);

app.get('/', (request, response) => {
  response.redirect('/index');
});

app.get('/about', (request, response) => {
  response.render('about', { title: "About" });
});

app.get('/add', (request, response) => {
  response.render('add', { title: "Add" });
});

app.get('/index', (request, response) => {
  response.render('index', { title: "Index" });
});

app.get('/search', (request, response) => {
  let { page, limit, title } = request.query;

  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 4; //4 items per page
  title = title || '';

  //console.log(`Query Parameters - Page: ${page}, Limit: ${limit}, Title: '${title}'`);

  const skip = (page - 1) * limit;
  const query = title ? { "title": new RegExp(title, "i") } : {};

  wiki.find(query).skip(skip).limit(limit)
      .then(wikis => {
       //   console.log(`Wikis found:`, wikis);
          wiki.countDocuments(query).then(totalItems => {
             // console.log(`Total items: ${totalItems}, Total pages: ${Math.ceil(totalItems / limit)}`);
              response.render('search', {
                  title: "Search",
                  wikis,
                  currentPage: page,
                  totalPages: Math.ceil(totalItems / limit),
                  hasNextPage: page * limit < totalItems,
                  hasPrevPage: page > 1,
                  nextPage: page + 1,
                  prevPage: page - 1,
                  limit
              });
          });
      })
      .catch(err => {
          console.error("Error:", err);
          response.render('search', { title: "Search", error: "Error occurred retrieving items" });
      });
});





app.use(errorHandler);

app.use((request, response) => {
  response.status(404).send('<h1>Page not found</h1>');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`Connection to database established`);
    app.listen(process.env.PORT, () => { 
      console.log(`Server listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Could not connect to database:`, error);
  });
