var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cors = require("cors");
var indexRouter = require('./routes/index');
const path = require('path');



app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(bodyParser.json());
app.use(cors());

app.use("/api",indexRouter);

app.listen(3000, () => console.log('app listening on port 3000!'));