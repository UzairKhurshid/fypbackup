//requiring db file to connect to database
require('./db/mongoose')

//requiring middleware
require('./middleware/expressMiddleware')

//requiring modules
const express =  require('express')
const hbs = require('hbs')
const path = require('path')
const bodyParser=require('body-parser')
const session=require('express-session')
const mongoDbStore=require('connect-mongodb-session')(session)
const csrf=require('csurf')

//required routes
const studentRouter=require('./routes/student')
const teacherRouter=require('./routes/teacher')
const projectRouter=require('./routes/project')
const dashboardRouter=require('./routes/dashboard')
const authRouter=require('./routes/auth')


const app = express()
const store=new mongoDbStore({
  uri:'mongodb://127.0.0.1:27017/fyp',
  collection:'sessions'  
})
const csrfProtection=csrf()


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
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({secret : 'mySecretKeyToHashMySessionValue' , resave : false , saveUninitialized : false , store : store }))
app.use(csrfProtection)


//using routes from external files

app.use((req,res,next) => {
    res.locals.csrfToken=req.csrfToken(),
    req.session.working="true"
    next()
})

app.use(studentRouter)
app.use(teacherRouter)
app.use(projectRouter)
app.use(dashboardRouter)
app.use(authRouter)


  

 
  app.listen(port)
  console.log('Listening to port: '+ port);