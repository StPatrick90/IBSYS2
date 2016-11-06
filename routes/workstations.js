/**
 * Created by Paddy on 03.11.2016.
 */
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:yppj@ds063546.mlab.com:63546/ibsys',['arbeitsplaetze']);

//Get All workstations
router.get('/workstations', function(req, res, next){
    db.arbeitsplaetze.find(function (err, workstations) {
        if(err){
            res.send(err);
        }
        res.json(workstations);
    })
});

module.exports = router;