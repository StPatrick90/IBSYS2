/**
 * Created by Paddy on 14.01.2017.
 */
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
//var db = mongojs('mongodb://admin:yppj@ds063546.mlab.com:63546/ibsys', ['prognosen']);
var db = mongojs('mongodb://localhost:27017/local', ['teile']);

//Get All Parts
router.get('/forecasts', function (req, res, next) {
    db.prognosen.aggregate(function (err, forecasts) {
        if (err) {
            res.send(err);
        }
        res.json(forecasts);
    })
});

module.exports = router;