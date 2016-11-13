/**
 * Created by Paddy on 13.11.2016.
 */
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:yppj@ds063546.mlab.com:63546/ibsys', ['teile']);

//Get All workstations
router.get('/parts', function (req, res, next) {
    db.teile.aggregate({
        $sort: {nummer: 1}
    }, function (err, teile) {
        if (err) {
            res.send(err);
        }
        res.json(teile);
    })
});

module.exports = router;