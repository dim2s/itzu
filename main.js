var http= require('http');
var url = require('url');
var querystring = require('querystring');
var express = require('express');
var fs = require('fs');


var app = express();


app.use("/client", express.static(__dirname + "/client"));
app.use("/libs", express.static(__dirname + "/libs"));
app.use("/libs/css", express.static(__dirname + "/libs/css"));

app.get('/', function(req,res){
	fs.readFile('./index.html', 'utf-8', function( error, content) {
		res.setHeader('Content-Type','text/html');
		res.end(content);
	});
});

app.get('/chnlabellist.json', function(req,res){
	fs.readFile('./data/chnlabellist.json', 'utf-8', function( error, content) {
		res.setHeader('Content-Type','text/html');
		res.end(content);
	});
});

app.get('/opImport.json', function(req,res){
	fs.readFile('./data/opImport.json', 'utf-8', function( error, content) {
		res.setHeader('Content-Type','text/html');
		res.end(content);
	});
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');

});

app.listen(8080);
