const express = require("express");
const app = express();
const path = require("path");

const cookieParser = require('cookie-parser')

const verifyJWT = require('./middleware/verifyJWT')

const errorHandler = require('./middleware/errHandler') 
const {logger} = require('./middleware/logEvents');


const homeRouter = require("./routes/homeRouter");
const employeeRouter = require('./routes/api/employeeRouter') 
const registerRouter = require('./routes/registerRouter')
const authRouter = require('./routes/authrouter')
const logoutRouter = require('./routes/logoutRouter')

const port = process.env.PORT || 3000;

//builtin middlewares
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use('/',express.static(path.join(__dirname,'public')))
app.use(cookieParser())

//3rd party middleware
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
app.use(cors(corsOptions))

//custommiddleware
app.use(logger)
app.use(require('./middleware/credentials'))

//routes
app.use('/auth',authRouter)
app.use('/register',registerRouter)
app.use('/',homeRouter)
app.use('/refresh',require('./routes/refreshRouter'))
app.use('/logout',logoutRouter)

//api routes
app.use('/api/employee', verifyJWT,employeeRouter);


app.all(/^\/.*/,(req,res)=>{
  res.status(404)
  if(req.accepts('html'))
    res.sendFile(path.join(__dirname,'views','404.html'))
  else if(req.accepts('json'))
    res.send({error:"404 Not Found"})
  else
    res.type('txt').send('404 Not Found')
})


app.use(errorHandler)

app.listen(port, () => {
  console.log("server running");
});
