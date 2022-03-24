"use strict";

var restify = require('restify');
var monster = require('./monsterid.js');

/*
 * TODO: bit more docs
 *       figure out debug and live-reloading
 *       tests (pretty easy, check get same binary for same string, check
 *       short strings, invalid URLs, sizes)
 *       ***NOT correctly 404ing currently***
 */
const  DEFAULT_SIZE = 20;

function respond(req, res, next) {
  let width = DEFAULT_SIZE;
  let height = DEFAULT_SIZE;

  if (req.query?.size) {
    width = req.query.size;
    height = req.query.size;
  }
  if (req.query?.width) width = req.query.width;
  if (req.query?.height) height = req.query.height;

  var img = monster.getAvatar(req.params.name, width, height);
  res.setHeader('Content-Type', 'image/png');
  res.send(img);
  next();
}

var server = restify.createServer({
    formatters: {
        'image/png': function formatPng(req, res, body) {
            if (body instanceof Error) {
                return body.stack;
            }
            //Just send the bytes - should be a Buffer
            return body;
        }
    },
    name: "dnmonster"

});

server.use(restify.plugins.queryParser());
server.get('/monster/:name', respond);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});
