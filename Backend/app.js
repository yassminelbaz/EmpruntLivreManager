//express framework to handle http request
const express = require('express');
const cookieParser = require('cookie-parser');
const authRouters = require('./routers/authRoutes');
const errorsHandler = require('./middlewares/errorsHandler');
const { checkUser } = require('./middlewares/authMiddleware');
const bookRouters = require('./routers/bookRoutes');
const logRoutes = require('./routers/logRoutes');
const cors = require('cors');


//initialise our express application by calling the express function, we will use it to define routes middlewaare
const app = express();


//MiddleWares

//middlware to accept json as the body object to our requestITMAKS SURE OUR SRVER CAN HANDLE REQ CONTAINING JSON DATA
app.use(express.json());
//serve static file from root diractory
app.use(express.static(__dirname));

app.use(cookieParser());

app.use(cors());



// Route par défaut
//pp.get('/',(req,res) => {
  //res.render("Home");
//});


//routes
app.get(checkUser);
app.use('/api', authRouters);
app.use('/api',bookRouters);
app.use('/api', logRoutes);

 


//gestion des erreurs
app.use(errorsHandler);





module.exports = app;