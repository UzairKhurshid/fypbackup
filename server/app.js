const express =  require('express')
const hbs = require('hbs')
const path = require('path')

const app = express()

// Define path for express config
const publicDirectory = path.join(__dirname, '../public')
const viewsDirectory = path.join(__dirname, '../views')
const partialsDirectory = path.join(__dirname, '../views/shared')


const port = process.env.PORT || 3000

// Setup handlers and views

app.set('views', viewsDirectory)
app.set('view options', { layout: '../views/layouts/main' });
app.set('view engine','hbs')

hbs.registerPartials(partialsDirectory)
app.use(express.static(publicDirectory))

app.get('/', function (req, res) {
    res.render('dashboard/index',{
        title:'Dashboard'
    })
  })

  app.get('/students', function (req, res) {
    res.render('students/index',{
        title:'Students'
    })
  })

  app.get('/students/create', function (req, res) {
    res.render('students/create',{
        title:'Students'
    })
  })
   
  app.listen(port)
  console.log('Listening to port: '+ port);