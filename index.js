const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');
const Registrations = require('./routes/regRoutes');
const Regservice = require('./services/regServices');
const postgres = require('pg');
const Pool = postgres.Pool;

const app = express();
 
let useSSL = false;
let local = process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/registration';
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
});

const reg = Regservice(pool)
const registrations = Registrations(reg);

const handlebarSetup = exphbs({
  partialsDir: "./views/partials",
  viewPath: "./views",
  layoutsDir: "./views/layouts",
});

app.use(session({
  secret : "error messages",
  resave: false,
  saveUninitialized: true,
}));
app.use(flash())
app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/",registrations.Home);
app.post('/registration',registrations.Register);
app.get('/filter/:filtered', registrations.filter);
app.get('/registration/reset', registrations.Reset);
  

let PORT = process.env.PORT || 1308;

app.listen(PORT, function(){
  console.log('App starting on port', PORT);
});