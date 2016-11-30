/**
 * Created by Paddy on 13.11.2016.
 */
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:yppj@ds063546.mlab.com:63546/ibsys', ['teile']);
//var db = mongojs('mongodb://localhost:27017/local', ['teile']);

//Get All Parts
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

//Get All E and P Parts
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

//Save Task
router.post('/part', function (req, res, next) {
    var part = req.body;
    for(var i = 0; i <= part.bestandteile.length -1; i++){
        if(part.bestandteile[i]._id){
            part.bestandteile[i]._id = new mongojs.ObjectID(part.bestandteile[i]._id);
        }
    }

    if(!part){
        res.status(400);
        res.json({
            "error": "Bad Data"
        })
    } else{
        db.teile.save(part, function (err, part) {
            if(err){
                res.send(err);
            }
            res.json(part);
        })
    }
})
//Update Task
router.put('/part/:id', function (req, res, next) {
    var part = req.body;

    if(!part){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else{
        db.teile.update({_id: mongojs.ObjectId(req.params.id)},part,{}, function (err, part) {
            if(err){
                res.send(err);
            }
            res.json(part);
        })
    }
})

//Delete Part
router.delete('/part/:id', function(req, res, next){
    db.teile.remove({_id: mongojs.ObjectId(req.params.id)}, function (err, part) {
        if(err){
            res.send(err);
        }
        res.json(part);
    })
});

module.exports = router;