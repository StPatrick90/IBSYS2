/**
 * Created by Paddy on 06.11.2016.
 */
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:yppj@ds063546.mlab.com:63546/ibsys', ['teile']);

//Get All workstations
router.get('/epparts', function (req, res, next) {
    db.teile.aggregate({
            $sort: {nummer: 1}
        },
        {
            $match: {
                $or: [
                    {typ: "E"},
                    {typ: "P"}
                ]
            }
        }, function (err, teile) {
            if (err) {
                res.send(err);
            }
            res.json(teile);
        })
});

module.exports = router;