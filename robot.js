'use strict'

const Botkit = require('botkit');
const config = require('./config/config');
const WitController = require('./lib/wit/controller');
const WitUtils = require('./lib/wit/wit-utils');

const express = require('express');

let app = express()
let botRunning = false;

app.get('/', function (req, res){
  console.log("Got root request");
  if(botRunning){
    res.send('Running');
  }
  else{
    res.send('Not running');
  }
});

if( !config.SLACK_TOKEN ){
  console.log('Error: Specify SLACK_TOKEN in environment');
  process.exit(1);
}

if( !config.WIT_TOKEN ) {
  console.log('Error: Specify WIT_TOKEN in environment');
  process.exit(1);
}

app.listen(config.PORT, (err) => {
  if (err) throw err
  console.log(`\nWeb Server running on ${config.PORT} 🚀`);
})

var controller = Botkit.slackbot({
  debug: config.BOT_DEBUG
});

// connect the bot to a stream of messages
controller.spawn({token: config.SLACK_TOKEN}).startRTM(
  function (err, bot) {
    if (err) {
        throw new Error(err);
    }
    botRunning = true;
  }
);

// Controllers
var witController = WitController.usingToken(config.WIT_TOKEN);

//detect interactions
controller.hears(['.*'],['direct_message', 'direct_mention'], witController.getMessageHandler());

witController.hears('*', 0.4, function(bot, message){
  console.log(`WIT AI PROCESSED: ${message.intent}, ${message.intentConfidence}`);
  bot.reply(message, `Wit.ai recognized intent \'${message.intent}\' at confidence ${message.intentConfidence}`);
});

var GreetingController = require('./lib/controllers/greeting');
controller.hears('^\s*hello\s*$',['direct_message', 'direct_mention'], GreetingController);
