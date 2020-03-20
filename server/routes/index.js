var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const AssistantV2 = require('ibm-watson/assistant/v2');
const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3')
const {
  IamAuthenticator
} = require('ibm-watson/auth');
require('custom-env').env('staging')
var sEssionID = null;
var uSerID = null;
/********* Creating Watson Assistant Object ********** */
const assistant = new AssistantV2({
  version: '2020-02-05',
  authenticator: new IamAuthenticator({
    apikey: process.env.API_KEY,
  }),
  url: process.env.URL,
});


/********* Creating Tone Analyzer Object ************** */
const toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  authenticator: new IamAuthenticator({
    apikey: 'rE8iV2c7J7Z0QCZQdrC8x6q0BvzWAw1uBzPf-qd6AWiH',
  }),
  url: 'https://api.eu-gb.tone-analyzer.watson.cloud.ibm.com',
});

router.post('/Verify', (req, resp, next) => {
  console.log("____________________________________");
  var url = "mongodb://localhost:27017/";
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Dashboard");
    dbo.collection("user").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      resp.send(result);
      db.close();
    });
  });
});

router.post('/CreateSession', (req, resp, next) => {

  //console.log(req.body);
  assistant.createSession({
      //assistantId: 'b4e71061-5863-485b-ab88-bf0358627cfa'
      assistantId: process.env.ASSISTANT_ID
    })
    .then(res => {
      console.log(JSON.stringify(res, null, 2));
      resp.send(res);
    })
    .catch(err => {
      console.log(err);
    });
});

router.post('/AskWatson', (req, resp, next) => {
  console.log("Send chat and post called with Input:", req.body);
  var date = new Date();
  var a = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2) + ("0" + date.getMilliseconds()).slice(-2);
  var time = ("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
  assistant.message({
      assistantId: process.env.ASSISTANT_ID,
      sessionId: req.body.session_id,
      input: {
        'message_type': 'text',
        'text': req.body.question
      }
    })
    .then(res => {
      //console.log(JSON.stringify(res, null, 2));
      console.log(res.result.output.entities);
      var url = "mongodb://localhost:27017/";
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Dashboard");
        sEssionID = req.body.session_id;
        uSerID = req.body.userID;
        var myobj = {
          id: a,
          time: time,
          Sender: 'user',
          sessionID: req.body.session_id,
          response_type: 'text',
          userID: req.body.userID,
          label: null,
          text: [req.body.question],
          intent: []
        };
        console.log(res.result.output.entities.length);
        for (var l = 0; l < res.result.output.entities.length; l++) {
          myobj.intent.push(String(res.result.output.entities[l].value));
        }

        dbo.collection("chat").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
        });
        var date = new Date();
        var b = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2) + ("0" + date.getMilliseconds()).slice(-2);
        var time1 = ("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
        for (var i = 0; i < res.result.output.generic.length; i++) {
          var myobj1 = {
            id: b,
            time: time1,
            Sender: 'bot',
            sessionID: req.body.session_id,
            response_type: null,
            userID: req.body.userID,
            label: [],
            text: [],
            intent: null
          };
          if (res.result.output.generic[i].response_type == 'text') {
            myobj1.text.push(String(res.result.output.generic[i].text));
            myobj1.response_type = 'text';
            myobj1.label = null;
          } else if (res.result.output.generic[i].response_type == 'option') {
            myobj1.response_type = 'option';
            for (var k = 0; k < res.result.output.generic[i].options.length; k++) {
              myobj1.label.push(String(res.result.output.generic[i].options[k].label));
              myobj1.text.push(String(res.result.output.generic[i].options[k].value.input.text));
            }
          }
        }
        dbo.collection("chat").insertOne(myobj1, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
        });

        dbo.collection("chat").find({}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
        });
      });

      resp.send(res)
    })
    .catch(err => {
      console.log(err);
    });
});

router.post('/AnalyzeTone', (req, res, next) => {
  console.log({
    utterances: req.body
  });
  toneAnalyzer.toneChat({
      utterances: req.body
    })
    .then(utteranceAnalyses => {
      var tone_dict = {
        excited: 0,
        frustrated: 0,
        impolite: 0,
        polite: 0,
        sad: 0,
        satisfied: 0,
        sympathetic: 0
      };
      this.totalUtterence = JSON.parse(JSON.stringify(utteranceAnalyses, null, 2)).result.utterances_tone.length;
      for (let i = 0; i < JSON.parse(JSON.stringify(utteranceAnalyses, null, 2)).result.utterances_tone.length; i++) {
        for (let j = 0; j < JSON.parse(JSON.stringify(utteranceAnalyses, null, 2)).result.utterances_tone[i].tones.length; j++) {
          tone_dict[JSON.parse(JSON.stringify(utteranceAnalyses, null, 2)).result.utterances_tone[i].tones[j].tone_id]++;
        }
      }
      var total = tone_dict.excited + tone_dict.frustrated + tone_dict.impolite + tone_dict.polite + tone_dict.sad + tone_dict.satisfied + tone_dict.sympathetic;
      var url = "mongodb://localhost:27017/";
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Dashboard");
        var myobj1 = {
          tone_dict: {
            excited: tone_dict.excited / total * 100,
            frustrated: tone_dict.frustrated / total * 100,
            impolite: tone_dict.impolite / total * 100,
            polite: tone_dict.polite / total * 100,
            sad: tone_dict.sad / total * 100,
            satisfied: tone_dict.satisfied / total * 100,
            sympathetic: tone_dict.sympathetic / total * 100
          },
          sessionID: sEssionID,
          userID: uSerID
        };

        dbo.collection("sentiment").insertOne(myobj1, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
        });
        dbo.collection("sentiment").find({}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
        });
      });
      res.send(utteranceAnalyses)
    })
    .catch(err => {
      console.log('error:', err);
    });
});

module.exports = router;