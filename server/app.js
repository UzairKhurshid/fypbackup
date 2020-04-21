//requiring db file to connect to database
require('./db/mongoose')

//requiring middleware
require('./middleware/expressMiddleware')

//requiring modules
const express = require('express')
const hbs = require('hbs')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongoDbStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const multer = require('multer')
const http = require('http')
const socketio = require('socket.io')


//required routes
const projectRouter = require('./routes/project')
const dashboardRouter = require('./routes/dashboard')
const proposedRouter = require('./routes/proposed')
const authRouter = require('./routes/auth')
const pagesRouter = require('./routes/pages')
const accountRouter = require('./routes/account')
const profileRouter = require('./routes/profile')
const myProjectRouter = require('./routes/myProject')
const chatRouter = require('./routes/chat')

const { generateMessage, saveMessage } = require('./helpers/chat')




const app = express()
const server = http.createServer(app)
const io = socketio(server)
const store = new mongoDbStore({
    uri: process.env.MONGODB_URL,
    collection: 'sessions'
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const csrfProtection = csrf()



// Define path for express config
const publicDirectory = path.join(__dirname, '../public')
const viewsDirectory = path.join(__dirname, '../views')
const partialsDirectory = path.join(__dirname, '../views/shared')

//**************************************************************************************** */
//regiter custom helpers
hbs.registerHelper('chkHelper', (val) => {
    return val
})
hbs.registerHelper('nextPageHelper', (val) => {
    const newVal = parseInt(val)
    let res = newVal + 1
    return parseInt(res)
})
hbs.registerHelper('prevPageHelper', (val) => {
    const newVal = parseInt(val)
    let res = newVal - 1
    if (res <= 0) {
        return 1
    }
    return parseInt(res)
})
hbs.registerHelper('chkChat', (val, email) => {
    if (val == email) {
        return "true"
    }
    return 'false'
})
hbs.registerHelper('chkNotification', (val) => {
    let res = 'X'
    if (val == 'Account') {
        res = "A"
    } else if (val == 'Project') {
        res = "P"
    } else if (val == 'Task') {
        res = "T"
    } else if (val == 'Request') {
        res = "R"
    } else {
        res = 'X'
    }
    return res
})


//**************************************************************************************** */


const port = process.env.PORT || 3000

// Setup handlers and views
app.set('views', viewsDirectory)
app.set('view options', { layout: '../views/layouts/main' });
app.set('view engine', 'hbs')

hbs.registerPartials(partialsDirectory)
app.use(express.static(publicDirectory))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(multer({ fileFilter: fileFilter }).single('avatar'))
app.use(session({ secret: 'mySecretKeyToHashMySessionValue', resave: false, saveUninitialized: false, store: store }))
app.use(csrfProtection)
app.use(flash())



//middleware that runs for every post req

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken(),
        next()
})

//using routes from external files

app.use(projectRouter)
app.use(proposedRouter)
app.use(dashboardRouter)
app.use(authRouter)
app.use(pagesRouter)
app.use(accountRouter)
app.use(profileRouter)
app.use(myProjectRouter)
app.use(chatRouter)
app.get('*', function(req, res) {
    res.render('404', {
        title: '404',
        pageError: 'Page Not Found'
    });
})


io.on('connection', (socket) => {
    console.log('new websocket connection ')

    socket.emit('message', generateMessage('', '', '', 'welcome ', ''))
    socket.broadcast.emit('message', generateMessage('', '', '', 'A User has joined', ''))
    socket.on('sendMessage', (FYPID, ownerEmail, name, msg, createdAt, callback) => {
        io.emit('message', generateMessage(msg, name))
        saveMessage(FYPID, ownerEmail, name, msg, createdAt)
        callback()
    })
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left!'))
    })
})




server.listen(port)
console.log('Listening to port: ' + port);