var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:yppj@ds063546.mlab.com:63546/ibsys',['VerbindlicheAuftraege']);

//Get all planned orders
router.get('/bindingOrders', function(req, res, next){
    db.VerbindlicheAuftraege.find(function (err, bindingOrders) {
        if(err){
            res.send(err);
        }
        res.json(bindingOrders);
    })
});

module.exports = router;