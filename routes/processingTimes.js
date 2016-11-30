/**
 * Created by Paddy on 06.11.2016.
 */
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:yppj@ds063546.mlab.com:63546/ibsys', ['bearbeitungszeiten']);
//var db = mongojs('mongodb://localhost:27017/local', ['bearbeitungszeiten']);

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

//Save ProcessingTimes
router.post('/processingTimes', function (req, res, next) {
    var processingTimes = req.body;
    for(var i = 0; i <= processingTimes.length -1; i++){
        if(processingTimes[i].arbeitsplatz){
            processingTimes[i].arbeitsplatz = new mongojs.ObjectID(processingTimes[i].arbeitsplatz);
        }
        if(processingTimes[i].teil){
            processingTimes[i].teil = new mongojs.ObjectID(processingTimes[i].teil);
        }
        if(processingTimes[i].nextArbeitsplatz){
            processingTimes[i].nextArbeitsplatz = new mongojs.ObjectID(processingTimes[i].nextArbeitsplatz);
        }
    }

    if(!processingTimes){
        res.status(400);
        res.json({
            "error": "Bad Data"
        })
    } else{
        db.bearbeitungszeiten.insert(processingTimes, function (err, processingTimes) {
            if(err){
                res.send(err);
            }
            res.json(processingTimes);
        })
    }
})

//Delete ProcessingTime
router.delete('/processingTime/:id', function(req, res, next){
    var ids = [];
    ids = req.params.id.split(',');

    for(i = 0; i < ids.length; i++){
        ids[i] = mongojs.ObjectId(ids[i]);
    }

    db.bearbeitungszeiten.remove({_id: {$in: ids}}, function (err, processingTime) {
        if(err){
            res.send(err);
        }
        res.json(processingTime);
    })
});



module.exports = router;