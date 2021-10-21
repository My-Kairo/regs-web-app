const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const Registrations = require('./routes/regRoutes');
const Regservice = require('./services/regServices')
const postgres = require('pg')
const Pool = postgres.Pool

const app = express();
 app.use(express.static('public'));

const session = require('express-session');
const flash = require('express-flash');
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/registration';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

const reg = Regservice(pool)
const registrations = Registrations(reg);

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

  app.use(bodyParser.urlencoded({ extended: false }));
//
app.use(bodyParser.json());
app.use(session({
  secret : "<add a secret string here>",
  resave: false,
  saveUninitialized: true
}));
app.use(flash())


app.get("/",registrations.Home);
app.post('/registration',registrations.Register);
app.get('/filter/:filtered', registrations.filter);
app.get('/registration/reset', registrations.Reset);
  

let PORT = process.env.PORT || 1608;

app.listen(PORT, function(){
  console.log('App starting on port', PORT);
});