'use strict';

const TelegramBot = require('node-telegram-bot-api');
const emoji = require('node-emoji');
const menu = require('./menu/menu.js');
const request = require('request');
const _ = require('underscore');
var token ;
var bot ;



exports.Run = function(config,api,logger,callback){ 
	const defChatId = config.tm.defChatId;
	token = config.tm.token;
    bot = new TelegramBot(token, { polling: true });


    bot.onText(/\/start/, function (msg, match) {

        let txt = menu.start_message;
        var fromId = msg.from.id;
        var chatId = msg.chat.id; 
    	bot.sendMessage(chatId, txt,menu.start);
    	api.init(fromId,chatId);
    	api.get(fromId).menu_item = 'start';
        																														
    });              
        
    bot.onText(/\/settings/, function (msg, match) {
        var chatId = msg.chat.id;
        var fromId = msg.from.id;
        bot.sendMessage(chatId,`${emoji.get('ok_hand')}`, menu.settings);
        api.setMenuItem(fromId,'settings');
    });

    bot.on('message', function (msg,match) {
        var chatId = msg.chat.id;  
        var fromId = msg.from.id;

        if(api.get(fromId) !== undefined) { 
            let item = api.get(fromId).menu_item;
            if(item === 'start' && msg.text !== 'Представьтесь, пожалуйста') {
            	api.get(fromId).name = msg.text;
            	bot.sendMessage(chatId,`Приятно познакомиться, ${msg.text}`,menu.main);
        		api.get(fromId).menu_item = 'main';
        		return;
             }
            if(item === 'response.email') {
            	if(!validateEmail(msg.text)) {
            		let txt = `Укажите,пожалуйста, вашу почту`;
	        		bot.sendMessage(chatId,txt);
            		return;
            	}
            	let txt = `В ближайшее время  с Вами свяжутся по указанной почте`;
	        	bot.sendMessage(chatId,txt,menu.main);
	        	bot.sendMessage(defChatId,`Заявка от ${msg.from.first_name} ${msg.from.last_name} @${msg.from.username} на почту ${msg.text}`);
	        	api.get(fromId).menu_item = 'main';
	        	return;

            }
            if(item === 'more_info' ) { }
            
         	 if(msg.text === 'Представьтесь, пожалуйста' && item === 'start'){
	        	bot.sendMessage(chatId,`Напишите,как мне к Вам обращаться`,menu.start);
	        	return;
	        }

	        if(msg.text === 'Меню' && item !== 'main'){
	        	let txt = `Переходим в меню`;
	        	bot.sendMessage(chatId,txt,menu.main);
	        	api.get(fromId).menu_item = 'main';
	        }

	        if(msg.text === 'Оставить заявку' && item === 'main'){
	        	let name = api.get(fromId).name;
	        	let txt = `${name} , связаться с  Вами в telegram  или по email`;
	        	bot.sendMessage(chatId,txt,menu.select_response);
	        	api.get(fromId).menu_item = 'submit_request';
	        }

	        if(msg.text === 'Связаться с разработчиком' && item === 'main'){
	        	let name = api.get(fromId).name;
	        	let txt = `${name} , Вам напишет в telegram наш сотрудник`;
	        	bot.sendMessage(chatId,txt,menu.main);
	        	bot.sendMessage(defChatId,`${msg.from.first_name} ${msg.from.last_name} @${msg.from.username} хочет личной консультации.`);
	        }

	        if(msg.text === 'Больше информации' && item === 'main'){
	        	api.get(fromId).menu_item = 'more_info';
	        }

	        if(msg.text === 'по email' && item === 'submit_request'){
	        	let txt = `${api.get(fromId).name} , отправьте мне вашу почту`;

	        	bot.sendMessage(chatId,txt,{reply_markup : {}});
	        	api.get(fromId).menu_item = 'response.email';
	        }

	        if(msg.text === 'в telegram' && item === 'submit_request'){
	        	let txt = `${api.get(fromId).name} , в ближайшее время Вам напишут для уточнения всех деталей`;
	        	bot.sendMessage(chatId,txt,menu.main);
	        	api.get(fromId).menu_item = 'main';
	        	
	        	bot.sendMessage(defChatId,`Заявка от ${msg.from.first_name} ${msg.from.last_name} @${msg.from.username}`);
	        }
    	}
    })

    function validateEmail(email) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	}



 	callback = callback || function() {};
    callback("Telegram bot");
}