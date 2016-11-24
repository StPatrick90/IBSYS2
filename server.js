/**
 * Created by Paddy on 21.10.2016.
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var tasks = require('./routes/tasks');
var workstations = require('./routes/workstations');
var processingTimes = require('./routes/processingTimes');
//var epparts = require('./routes/epparts');
var xml = require('./routes/xmlConverter');
var parts = require('./routes/parts');
var results = require('./routes/results');
var kparts = require('./routes/kparts');


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
app.use('/api', workstations);
app.use('/api', processingTimes);
//app.use('/api', epparts);
app.use('/api', xml);
app.use('/api', parts);
app.use('/api', results);
app.use('/api', kparts);


app.listen(port, function(){
    console.log('Server wurde auf Port ' + port + ' gestartet!');
});


