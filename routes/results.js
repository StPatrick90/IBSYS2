/**
 * Created by philipp.koepfer on 16.11.16.
 */

var express = require('express');

//Get All Tasksuire('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:yppj@ds063546.mlab.com:63546/ibsys',['results']);

router.get('/results', function(req, res, next){
    db.results.find(function (err, results) {
        if(err){
            res.send(err);
        }
        res.json(results);
    })
});


router.post('/result', function (req, res, next) {
    var result = req.body;

    db.results.save(result, function (err, result) {
        if(err){
            res.send(err);
        }
        res.json(result);
    })
})

module.exports = router;