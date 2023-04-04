var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var Message = mongoose.model("Message", {
  name: String,
  message: String,
  date: Date,
});

var dbUrl = "mongodb+srv://200506823:z1QVv8esv8O3cobj@cluster0.kmceijo.mongodb.net/?retryWrites=true&w=majority";

app.get("/messages", (req, res) => {
  Message.find({}, (error, messages) => {
    res.send(messages);
  }).sort({date: 1});
});  

app.post("/messages", (req, res) => {
  var message = new Message(req.body);
  message.save((err) => {
    if (err) sendStatus(500);
    io.emit('message', req.body);
    res.sendStatus(200);
  });
});

io.on('connection', () => { 
    console.log('A User is connected!');
});

mongoose.connect(dbUrl, (err) => {
  console.log("MongoDB Connected", err);
});

var server = http.listen(3000, () => {
  console.log("Server is running on port", server.address().port);
});
