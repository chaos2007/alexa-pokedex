'use strict';

var Alexa = require('alexa-sdk');
var APP_ID = undefined; //OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';
var SKILL_NAME = 'Pokedex Weakness and Strengths';
var weaknesses = require('./weaknesses');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    //Use LaunchRequest, instead of NewSession if you want to use the one-shot model
    //Alexa, ask [my-skill-invocation-name] to (do something)...
    /*
    'NewSession': function () {
        this.attributes['speechOutput'] = 'Welcome to ' + SKILL_NAME + '. You can ask a question like, what is' +
            ' fire weak against? ... Now, what can I help you with.';
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes['repromptSpeech'] = 'For instructions on what you can say, please say help me.';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },*/
    'LaunchRequest': function () {
        this.attributes['speechOutput'] = 'Welcome to ' + SKILL_NAME + '. You can ask a question like, what is' +
            ' fire weak against? ... Now, what can I help you with.';
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes['repromptSpeech'] = 'For instructions on what you can say, please say help me.';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'WeaknessIntent': function () {
        var typeSlot = this.event.request.intent.slots.Type;
        var typeName;
        if (typeSlot && typeSlot.value) {
            typeName = typeSlot.value.toLowerCase();
        }

        var cardTitle = SKILL_NAME + ' - Weaknesses for ' + typeName;
        var weakness = weaknesses[typeName];

        if (weakness) {
            this.attributes['speechOutput'] = typeName + " type pokemon are weak against, ";
            var i;
            for( i = 0; i < weakness.length; i++ ) {
                if( weakness.length > 1 && i == weakness.length - 1 ) {
                    this.attributes['speechOutput'] += "and " + weakness[i];
                } else {
                    this.attributes['speechOutput'] += weakness[i] + ", ";
                }
            }
            this.attributes['speechOutput'] += " pokemon";
            this.attributes['repromptSpeech'] = 'Try saying repeat.';

            this.emit(':askWithCard', this.attributes['speechOutput'], this.attributes['repromptSpeech'], cardTitle, this.attributes['speechOutput']);
        } else {
            var speechOutput = 'I\'m sorry, I currently do not know ';
            var repromptSpeech = 'What else can I help with?';
            if (typeName) {
                speechOutput = 'the weakness for ' + typeName + '. ';
            } else {
                speechOutput = 'that pokemon type. ';
            }
            speechOutput += repromptSpeech;

            this.attributes['speechOutput'] = speechOutput;
            this.attributes['repromptSpeech'] = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = 'You can ask questions such as, what is fire weak against, or, you can say exit... ' +
            'Now, what can I help you with?';
        this.attributes['repromptSpeech'] = 'You can say things like, what is fire weak against, or you can say exit...' +
            ' Now, what can I help you with?';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', 'Goodbye!');
    }
};
