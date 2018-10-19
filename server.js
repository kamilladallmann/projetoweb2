var express = require('express');
var multer = require('multer');
bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');
var Detail = require('./models/detail');
var createError = require('http-errors');
var path = require('path');
var session = require('express-session');
var tokenSecreto = false;

var indexRouter = require('./routes/index');
/*var upload = multer({ dest: 'uploads/' });*/
mongoose.connect('mongodb://localhost/uploadFiles', { useMongoClient: true });


var upload = multer({
  storage: multer.diskStorage({

    destination: function (req, file, callback) { callback(null, './uploads'); },
    filename: function (req, file, callback) { callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); }

  }),

  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(/*res.end('Only images are allowed')*/ null, false)
    }
    callback(null, true)
  }
});

var app = new express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'super secret session key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('uploads'));


  app.get('/', function (req, res) {
    if (req.session && req.session.login){
    Detail.find({}, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.render('index', { data: data });
      }
    })
  }else{
    res.render('login');
  }
  });

app.post('/', upload.any(), function (req, res) {

  if (!req.body && !req.files) {
    res.json({ success: false });
  } else {
    var c;
    Detail.findOne({}, function (err, data) {
      console.log("into detail");

      if (data) {
        console.log("if");
        c = data.unique_id + 1;
      } else {
        c = 1;
      }

      var detail = new Detail({
        unique_id: c,
        name: req.body.title,
        image1: req.files[0].filename,
      });

      detail.save(function (err, Person) {
        if (err)
          console.log(err);
        else
          res.redirect('/');

      });

    }).sort({ _id: -1 }).limit(1);

  }
});

app.post('/delete', function (req, res) {

  Detail.findByIdAndRemove(req.body.prodId, function (err, data) {
    console.log(data);
    //alert('Foto deletada com sucesso');
  })
  res.redirect('/');
});

app.get('/buscar', function (req, res) {
  console.log(req);
  Detail.find({ name: req.query.nome }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
      res.render('index', { data: data });
    }
  })
});

//app.post('/cadastro', function (req, res) {

   // console.log(data);
   // res.sender('cadastro', {data: data});
    
//});

app.post('/login', function (req, res, next) {
  console.log(req.body);
  let login = req.body.email,
      password = req.body.pass;
      if (login === 'teste' && password === 'pass'){
        tokenSecreto = true;
        Detail.find({}, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            req.session.login = 'teste';
            res.redirect('/');
            res.render('index', { data: data });            
          }
        })
      }else{
        res.status(403);
        res.write('<h1>Senha incorreta!!!</h1>');
        res.end();
      }
});

var port = 3000;
app.listen(port, function () { console.log('listening on port ' + port); });