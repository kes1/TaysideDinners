/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined;  //APP_ID here. 



// Menu details. These could be taken from a database but are static for the school year. 
const menu_exceptions = {
    // Special days that have special dishes that replace the choice indexed.
    30112017 : ['Corned Beef Stovies'], // These replace red choice.
    25012018 : ['Haggis']
};

const weeks = {
    // Week in rotation : [Dates of the Saturday of that week] 
    1: ['21082017','18092017','16102017','13112017','11122017','08012018','0502018','05032018'],
    2:['28082017','25092017','23102017','23102017','20112017','18122017','15012018','15012018','12022018','12032018'],
    3:['04092017','02102017','30102017','30102017','27112017','22012018','19022018','19032018'],
    4:['14082017','11092017','06112017','04122017','29012018','26022018','26032018']
};
const menu ={
    // week[(day)[menu options that week - option 1, option 2, veggie_choice, sandwich]]
    // [Red Choice, Blue Choice, Green Choice, Yellow Choice ]
    1:[     
        ['Chicken Curry','Fishcake','Hot Dog Roll','Ham Sandwich'], //Mon
        ['Oven Baked Sausages in Gravy','BBQ Chicken','Macaroni Cheese','Roast Beef Sandwich'], //Tues
        ['Traditional Mince','Fish Goujons','Cheese and Tomato Pizza','Chicken Mayo Wrap'], //Wed
        ['Beef Burger Roll','Tortilla Chicken Lasagne','VegeBalls with BBQ Sauce','Tuna Mayo Sandwich'], //Thurs
        ['Baked Baked Potato', 'Breaded Fish','Savoury Rice','Turkey Roll']
    ],
    2:[
        ['Meatballs in Tomato Sauce','Fishcake'],
        ['Lentil Soup','Bolognese Mince'],
        ['Roast Beef, Gravy and Yorkshire Pudding','Moroccan Chicken'],
        ['Chicken Burger Roll','Pork Casserole'],
        ['Oven Baked Sausages','Breaded Fish']
    ],
    3:[
        ['Turkey Burger Roll','Fish Pie'],
        ['Oven Baked Sausages in Gravy'],
        ['Steak Pie'],
        ['Chicken Nuggets'],
        ['Sweet n Sour Chicken']
        ],
    4:[
        ['Sausage Roll','Tuna Mayo Baked Potato','Tomato Pasta','Turkey Sandwich'], // Mon
        ['Chinese Chicken Curry','Fish Fingers','VegeBall Wrap','Cheese Roll'], // Tues
        ['Cottage Pie','Creamy Ham Pasta','"Cheese and Tomato Pizza"','Chicken Sandwich'],//Wed
        ['Winter Vegetable Soup','Beef Burger Roll','Sweet Chilli Chicken','Vegetable Nuggets','Tuna Mayo Wrap'],//Thurs
        ['Chicken Fajita','Breaded Fish','Macaroni Cheese','Ham Sandwich'] //Fri
        ]
    
    
};

function getMenuCard(menuArray, date){
    var card = {};
    card.title = date.toLocaleDateString('en-GB', { weekday: 'long' }) + " School Menu";
    card.text = menuArray.join('\n');
    card.imageObj = {
    smallImageUrl: 'http://www.tayside-contracts.co.uk/_assets/_img/logo.gif',
    largeImageUrl: 'http://www.tayside-contracts.co.uk/_assets/_img/logo.gif'
};
    return card;
}


const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask',"Hi, you can ask what's for lunch?");
    },
    'getLunchMenu': function(){
        try {
        // Get Date requested from Slot - default to today. 
        var req_date;
        if ( !this.event.request.intent.slots.Date || this.event.request.intent.slots.Date.value == ''||this.event.request.intent.slots.Date.value == undefined) {
        req_date = new Date();
        }
        else{
            req_date = new Date(this.event.request.intent.slots.Date.value);
        }
        var req_monday = new Date(req_date.getTime());
        if (req_date.getDay() !== 1)
        {
            req_monday.setDate(req_date.getDate()-req_date.getDay()+1); // Snap to Monday to find wk.
        }
        if (req_date.getDay() == 0 ||req_date.getDay() == 6){
            this.emit(':ask',"Sorry schools closed at the weekend. Try asking what's for lunch on Monday.");    
            return;        
        }
    
        var s_req_monday = ('0' + req_monday.getDate()).slice(-2) + ('0' + (req_monday.getMonth()+1)).slice(-2) + req_monday.getFullYear();// Monday of the week requested
        var req_week = 0;
        // TODO Screen for School Holidays / Weekends

      
       // Get week from date.
       for (var candidate_week in weeks){
           if (weeks[candidate_week].indexOf(s_req_monday) !== -1){
               req_week = candidate_week;
               break;
           }
       }
    
    if (req_week > 0)
    {

       var mealsArray = menu[req_week][req_date.getDay()-1];
       // Get meals
       var mealString = "You can choose from ";
       
       for (var i=0;i< mealsArray.length-1;i++)
       {
           mealString = mealString + mealsArray[i] + ", ";
       }
       mealString = mealString + " or a " +  mealsArray[i];
       var menuCard = getMenuCard(mealsArray, req_date);
       this.emit(':tellWithCard',mealString, menuCard.title, menuCard.text); 
       }
       else
       {
           this.emit(':ask', "Sorry I couldn't find a meal for the <say-as interpret-as='date' format='dm'>" + req_date+ "</say-as> can you ask for a different day?", "Try asking what's for lunch on Monday?");
       }
        }
        catch(e){
            // Unhandled Exception
            this.emit(':tell',"I'm sorry something went wrong checking the menu, please try again later.");
        }
    },
    
    'AMAZON.HelpIntent': function () {
        const speechOutput = "You can ask what's for lunch today";
        const reprompt = "Ask what's for lunch";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', "Bye.");
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', "Enjoy your lunch.");
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.registerHandlers(handlers);
    alexa.execute();

};
