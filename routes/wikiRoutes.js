const express = require('express');
const router = express.Router();
const wiki = require('../model/wiki'); 

/*router.get('/v1/search', (request, response) => {
  const title = request.query.title;

  if (title) {
    wiki.find({ "title": { "$regex": title, "$options": "i" } })
      .then((data) => {
        response.render("search", { title: "Search Item", wikis: data, error: "" });
      })
      .catch((err) => {
        response.render("search", { title: "Search Item", wikis: [], error: "Error occurred during search" });
      });
  } else {
    wiki.find({})
      .then((data) => {
        response.render("search", { title: "All Items", wikis: data, error: "" });
      })
      .catch((err) => {
        response.render("search", { title: "All Items", wikis: [], error: "Error occurred retrieving items" });
      });
  }
});*/

router.get('/v1/search', (request, response) => {
  let { page, limit, title } = request.query;

  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 4; //4 items per page
  title = title || '';

  const skip = (page - 1) * limit;
  const query = title ? { "title": { "$regex": title, "$options": "i" } } : {};

  wiki.find(query).skip(skip).limit(limit)
      .then(wikis => {
          wiki.countDocuments(query).then(totalItems => {
              response.render('search', {
                  title: title ? "Search Item" : "All Items",
                  wikis,
                  currentPage: page,
                  totalPages: Math.ceil(totalItems / limit),
                  hasNextPage: page * limit < totalItems,
                  hasPrevPage: page > 1,
                  nextPage: page + 1,
                  prevPage: page - 1,
                  limit,
                  error: ""
              });
          });
      })
      .catch(err => {
          response.render('search', {
              title: title ? "Search Item" : "All Items",
              wikis: [],
              error: "Error occurred retrieving items",
              totalPages: 0,
          });
      });
});


router.get('/v1/add', (request, response) => {
  response.render('add', { title: "Add" });
});

router.get('/v1/about', (request, response) => {
  response.render('about', { title: "About" });
});

router.get('/v1/index', (request, response) => {
  response.render('index', { title: "Index" });
});


router.post('/delete/:id', (request, response) => {
  const id = request.params.id;
  wiki.findOneAndDelete({ _id: id })
      .then(() => {
          response.redirect('/search');
      })
      .catch(err => {
          response.status(500).send('Error deleting entry');
      });
});

router.post('/update/:id', (request, response) => {
  const id = request.params.id;
  const updatedData = request.body;

  wiki.findByIdAndUpdate(id, updatedData, { new: true })
      .then(result => {
          response.redirect('/search');
      })
      .catch(err => {
          response.status(500).send('Error updating entry');
      });
});

router.post('/v1/', (request, response) => {
  const { title, Location, date, Company, category, description } = request.body;
  const new_wiki = new wiki({
    title, 
    location: Location,
    date, 
    company: Company, 
    category, 
    description
  });

  new_wiki.save()
    .then(result => {
      response.render('about', { title: "About", message: 'Project added successfully', error: '' });
    })
    .catch(error => {
      response.render('about', { title: "About", message: '', error: 'Project failed to be added' });
    });
});

module.exports = router;