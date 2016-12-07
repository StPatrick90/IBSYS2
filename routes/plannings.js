var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
//var db = mongojs('mongodb://admin:yppj@ds063546.mlab.com:63546/ibsys',['Geplant']);
var db = mongojs('mongodb://localhost:27017/local', ['Geplant']);

// GET all planned orders
router.get('/plannings', function(req, res, next){
    db.Geplant.find(function (err, plannings) {
        if(err){
            res.send(err);
        }
        res.json(plannings);
    })
});

module.exports = router;