/**
 * Created by Jonas on 16.11.16.
 */

var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
//var db = mongojs('mongodb://admin:yppj@ds063546.mlab.com:63546/ibsys', ['teile']);
var db = mongojs('mongodb://localhost:27017/local', ['teile']);

//Get Purchase Parts
router.get('/kparts', function (req, res, next) {

    db.teile.find({
            "typ": "K"
        },
        function (err, kparts) {
            if (err) {
                res.send(err);
            }
            res.json(kparts);
        })
});

module.exports = router;