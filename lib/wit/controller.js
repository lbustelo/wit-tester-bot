var Wit = require('node-wit').Wit;
var WitUtils = require('./wit-utils');

const WILDCARD = '*';

function WitController(wit) {
  this.wit = wit;
  this._hears = {}; // intent -> {confidence: <[0-1]>, func: <handler>}
}

WitController.prototype.addHandlerForIntent = function(intent, confidence, handler) {
  this._hears[intent] = this._hears[intent] || [];
  this._hears[intent].push({
    confidence: confidence,
    handler: handler
  });
};

WitController.prototype.getMessageHandler = function() {
  return this.process.bind(this);
};

WitController.prototype.process = function(bot, message) {
  console.log('Processing using wit.ai');
  this.wit.message(message.text).then(
    function(data) {
      console.log('Got data from wit.ai', JSON.stringify(data));
      const intent = intentFrom(data.entities);
      if (intent){
        console.log(`Getting handler for intent ${intent.value}`);
        var intentHandler = this.hearsForIntent(intent.value, intent.confidence);

        // Decorate message with data
        message.entities = data.entities;
        message.intent = intent.value;
        message.intentConfidence = intent.confidence;

        if (intentHandler) {
          if (intentHandler.constructor === Array) {
            intentHandler.forEach(function(handler) {handler.call(null, bot, message);});
          } else {
            intentHandler.call(null, bot, message);
          }
        }
        else{
          console.error(`Did not have a handler for intent ${intent.value}`);
        }
      }
      else{
        console.error(`wit.ai did not return an intent for <${message.text}>`);
      }
    }.bind(this)
  ).catch(console.error);
};

/**
 * If there are multiple handlers registered, return an array with all the handlers that meet the confidence threshold
 * otherwise just return the handler if it meets the threshold
 * */
WitController.prototype.hearsForIntent = function(value, confidence) {
  confidence = confidence || 0;

  console.log( "lookup", arguments);

  var allHandlers = (this._hears[value] || []).concat(this._hears[WILDCARD] || []);

  return allHandlers.map(function(hear) {
    if (hear.confidence < confidence) {
      return hear.handler;
    }
  });
};

WitController.prototype.hears = function(intent, confidence, handler) {
  if (intent.constructor && intent.constructor === Array) {
    for (let i = 0; i < intent.length; i++) {
      this.addHandlerForIntent(intent[i], confidence, handler);
    }
  } else {
    this.addHandlerForIntent(intent, confidence, handler);
  }
};

function intentFrom(entities) {
  return entities['intent'] && entities['intent'][0];
}

var getIntent = WitUtils.getBestEntity.bind(null, 'intent');

module.exports = WitController;

module.exports.usingToken = function(token){
  var wit = new Wit({accessToken: token});
  return new WitController(wit);
};
