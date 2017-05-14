'use strict';

const express = require('express');
const tm_bot = require('./tm.js');
var app = express();
var http = require('http').Server(app);
const config = require('./config.json')
const emoji = require('node-emoji');

const log4js = require('log4js');
const logger = log4js.getLogger();

http.on('error', function(err) {
	console.log(err);
	logger.debug("error" + err);
});
var data = {} ;

var api = {
	init : function(id,chatId) { 
		data[id] = { 
			name : '',
			chatId : chatId,		
			menu_item : 'main',
		} 
	},
	setMenuItem : function(id,item) { data[id].menu_item = item },
	get : function(id) { return data[id]; }
}

http.listen(process.env.PORT || 5000);

tm_bot.Run(config,api,logger, function(name){ console.log(name + ' started.'); });

process.on('uncaughtException', function(err) {
    console.log(err);
});