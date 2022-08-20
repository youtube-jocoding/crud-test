var express = require('express');
var app = express();

let data = [];

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});
const Comments = sequelize.define('Comments', {
  // Model attributes are defined here
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  // Other model options go here
});

// `sequelize.define` also returns the model
console.log(Comments === sequelize.models.Comments); // true

Comments.sync();


// set the view engine to ejs
app.set('view engine', 'ejs');

// app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// index page
app.get('/', async function(req, res) {
    // Find all users
    const comments = await Comments.findAll();
    data = comments;
    res.render('index', { data });
});

app.post('/create', async function(req, res) {
    console.log(req.body)
    
    // Create a new user
    const jane = await Comments.create(req.body);
    console.log("Jane's auto-generated ID:", jane.id);

    res.redirect('/')
});

app.post('/update/:id', async function(req, res) {
  console.log(req.params)
  console.log(req.body)
  const { id } = req.params;
  const { content } = req.body;
  
  const result = await Comments.update({ content: content }, {
    where: {
      id: id
    }
  });

  console.log(result);

  res.redirect('/')
});

app.post('/delete/:id', async function(req, res) {
  console.log(req.params)
  const { id } = req.params;
  
  await Comments.destroy({
    where: {
      id: id
    }
  });

  res.redirect('/')
});


app.listen(3000);
console.log('Server is listening on port 3000');