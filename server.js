/**
 * Created by Paddy on 21.10.2016.
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');

var index = require('./routes/index');
var tasks = require('./routes/tasks');
var xml = require('./routes/xmlConverter')

var port = 3000;

var app = express();

//View Engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);

//Set Static Folder
app.use(express.static(path.join(__dirname, 'client')));

//Body Parser MiddleWare
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/',index);
app.use('/api', tasks);
app.use('/api', xml);

var DIR = './uploads/';

var upload = multer({dest: DIR});

app.use(function (req, res, next) {
    //res.setHeader('Access-Control-Allow-Origin', 'http://valor-software.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(multer({
    dest: DIR,
    rename: function (fieldname, filename) {
        return filename + Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path);
    }
}).any());

app.get('/api', function (req, res) {
    res.end('file catcher example');
});

app.post('/api', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            return res.end(err.toString());
        }

        res.end('File is uploaded');
    });
});





app.listen(port, function(){
    console.log('Server wurde auf Port ' + port + ' gestartet!');
});


