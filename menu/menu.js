const emoji = require('node-emoji');


const menu = {

    start : {
      reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: false,
        keyboard: [[`Представьтесь, пожалуйста`]]
      }
    },

    main : {
      reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: false,
        keyboard: [[`Оставить заявку`],[`Связаться с разработчиком`]]
      }
    },

    select_response : {
      reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: false,
        keyboard: [[`по email`],[`в telegram`],[`Меню`]]
      }
    },

    faq : {
      reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: false,
        keyboard: [[`1.Сколько стоит разработка бота?`],[`2.Какой функционал может иметь бот?`],[`3.Как долго разрабатывается бот?`]]
      }
    },

    next_dialog_page : {
        reply_markup: JSON.stringify({
            inline_keyboard: [
              [{ text: `Далее${emoji.get('arrow-right')}`, callback_data: `/nextDialogPage` }]              
            ]
        })
    },

    

    

    start_message : `Привет! Я отвечаю за прием заявок на разработку ботов и постараюсь помочь Вам. Как мне к Вам обращаться?` ,

    help : `*Команды:*
        _settings_ - настройки
        _dialogs_ - сообщения
        _friends_ - список друзей
        _help_ - помощь
        `
}

module.exports = menu;
