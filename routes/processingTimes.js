/**
 * Created by Paddy on 06.11.2016.
 */
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
//var db = mongojs('mongodb://admin:yppj@ds063546.mlab.com:63546/ibsys', ['bearbeitungszeiten']);
var db = mongojs('mongodb://localhost:27017/local', ['bearbeitungszeiten']);

//Get All workstations
router.get('/processingTimes', function (req, res, next) {
    db.bearbeitungszeiten.aggregate(
        {
            $lookup: {
                from: "arbeitsplaetze",
                localField: "arbeitsplatz",
                foreignField: "_id",
                as: "arbeitsplatz"
            }
        },
        {$unwind: "$arbeitsplatz"},
        {
            $lookup: {
                from: "teile",
                localField: "teil",
                foreignField: "_id",
                as: "teil"
            }
        }, {$unwind: "$teil"},
        {
            $lookup: {
                from: "arbeitsplaetze",
                localField: "nextArbeitsplatz",
                foreignField: "_id",
                as: "nextArbeitsplatz"
            }
        }, {
            $unwind: {
                "path": "$nextArbeitsplatz",
                "preserveNullAndEmptyArrays": true
            }
        }, function (err, processingTimes) {
            if (err) {
                res.send(err);
            }
            res.json(processingTimes);
        })
});

module.exports = router;