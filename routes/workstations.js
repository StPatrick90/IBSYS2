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

//Save Workstation
router.post('/workstation', function (req, res, next) {
    var workstation = req.body;
    if(!workstation.nummer || !workstation.name){
        res.status(400);
        res.json({
            "error": "Bad Data"
        })
    } else{
        db.arbeitsplaetze.save(workstation, function (err, workstation) {
            if(err){
                res.send(err);
            }
            res.json(workstation);
        })
    }
})

//Update Task
router.put('/workstation/:id', function(req, res, next){
    var workstation = req.body;
    var updWorkstation = {};

    if(workstation.nummer){
        updWorkstation.nummer = workstation.nummer;
    }

    if(workstation.name){
        updWorkstation.name = workstation.name;
    }

    if(!updWorkstation){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else{
        db.arbeitsplaetze.update({_id: mongojs.ObjectId(req.params.id)},updWorkstation,{}, function (err, workstation) {
            if(err){
                res.send(err);
            }
            res.json(workstation);
        })
    }


});

//Delete Task
router.delete('/workstation/:id', function(req, res, next){
    db.arbeitsplaetze.remove({_id: mongojs.ObjectId(req.params.id)}, function (err, workstation) {
        if(err){
            res.send(err);
        }
        res.json(workstation);
    })
});

module.exports = router;