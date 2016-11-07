/**
 * Created by philipp.koepfer on 05.11.16.
 */

var express = require('express');
var parser = require('xml2json');
var router = express.Router();

router.post('/xmlConverter', function (req, res, next) {
    var xml = req.body;

    if(xml.name === null || xml.name === ''){
        res.status(400);
        res.json({
            "error": "Bad Data"
        })
    } else{
        var jsonObj = parser.toJson(xml.name);
        res.json(jsonObj);
    }
})

module.exports = router;


