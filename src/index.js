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

const APP_ID = 'amzn1.ask.skill.2c5a40a0-3cef-4815-b74c-8432129291bf';  //APP_ID here. 

// Helper Function from Alexa Cookbook. 
function sayArray(myData, andor) {
    // the first argument is an array [] of items
    // the second argument is the list penultimate word; and/or/nor etc.

    var listString = '';

    if (myData.length == 1) {
        listString = myData[0];
    } else {
        if (myData.length == 2) {
            listString = myData[0] + ' ' + andor + ' ' + myData[1];
        } else {

            for (var i = 0; i < myData.length; i++) {
                if (i < myData.length - 2) {
                    listString = listString + myData[i] + ', ';
                    if (i = myData.length - 2) {
                        listString = listString + myData[i] + ', ' + andor + ' ';
                    }

                } else {
                    listString = listString + myData[i];
                }

            }
        }

    }

    return(listString);
}



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
    primary:{
    // week[(day)[menu options that week - option 1, option 2, veggie_choice, sandwich, desert (or fruit selection)]]
    // [Red Choice, Blue Choice, Green Choice, Yellow Choice, last option (or fruit selection) ]
    1:[     
        ['Chicken Curry','Fishcake','Hot Dog Roll','Ham Sandwich','Ice cream with Fuity Sauce and wafer'], //Mon
        ['Oven Baked Sausages in Gravy','BBQ Chicken','Macaroni Cheese','Roast Beef Sandwich','Tiffin'], //Tues
        ['Traditional Mince','Fish Goujons','"Cheese and Tomato Pizza"','Chicken Mayo Wrap',"St Clements Sponge with Custard"], //Wed
        ['Beef Burger Roll','Tortilla Chicken Lasagne','VegeBalls with BBQ Sauce','Tuna Mayo Sandwich',"Fruit"], //Thurs
        ['Baked Potato', 'Breaded Fish','Savoury Rice','Turkey Roll',"Chocolate Muffin"]
    ],
    2:[
        ['Meatballs in Tomato Sauce','Chicken and Gravy Pie','Macaroni Cheese','Ham Sandwich','Banoffee Sponge'],
        ['Bolognese Mince','Fish Fingers','Curried Quorn Wrap','Cheese Mayo Roll','Fruit'],
        ['Roast Beef, Gravy and Yorkshire Pudding','Moroccan Chicken','Cheese and Tomato Pizza','Turkey Sandwich','Caramel Shortbread'],
        ['Chicken Burger Roll','Pork Casserole','Vegetable Frittata','Tuna Mayo Wrap','Choclate Brownie with Custard'],
        ['Oven Baked Sausages','Breaded Fish','Brocolli Pasta Bake','Chicken Roll','Rice Pudding with Mandarins']
    ],
    3:[
        ['Turkey Burger Roll','Fish Pie','Quorn, Gravy and Yorkshire Pudding','Cheese Sandwich','Chocolate Cookie'],
        ['Baked Sausages in Gravy','Savoury Chicken Rice','Cheese and tomato Pizza','Turkey Sandwich','Waffles with Peaches'],
        ['Steak Pie','Fish Goujons','Vegetable Curry','Coronation Chicken Wrap','Lemon Drizzle Sponge with Custard'],
        ['Chicken Nuggets','Mild Beef Chilli','Macaroni Cheese','Tuna Mayo Sandwich','Fruit'],
        ['Sweet n Sour Chicken','Breaded Fish','Cheese and Potato Cake','Ham Roll','Cheese with Crackers']
        ],
    4:[
        ['Sausage Roll','Tuna Mayo Baked Potato','Tomato Pasta','Turkey Sandwich','Shortbread'], // Mon
        ['Chinese Chicken Curry','Fish Fingers','VegeBall Wrap','Cheese Roll','Chocolate Brownie'], // Tues
        ['Cottage Pie','Creamy Ham Pasta','"Cheese and Tomato Pizza"','Chicken Sandwich','Jelly with Fruit'],//Wed
        ['Beef Burger Roll','Sweet Chilli Chicken','Vegetable Nuggets','Tuna Mayo Wrap','Fruit Selection'],//Thurs
        ['Chicken Fajita','Breaded Fish','Macaroni Cheese','Ham Sandwich','Pear and Honey Muffin'] //Fri
        ]
    },
    secondary:
    {
        1:[ // Vege still always option 3.
            ["Chicken Curry", "Fishcake", "Quorn Curry"], //Mon
            ["Oven Baked Sausages &amp; Gravy","BBQ Chicken","Macaroni Cheese"], //Tue
            ["Traditional Mince","Scampi","Vegetable Calzone"], //Wed
            ["Pork Steak &amp; Gravy","Tortilla Chicken Lasagne","VegeBalls with BBQ Sauce"], //Thurs
            ["Chicken Jambalaya","Breaded Fish","Savoury Rice"] //Fri
        ],
        2:[
            ["Meatballs in Tomato Sauce","Chicken &amp; Gravy Pie","Macaroni Cheese"],
            ["Bolognese Mince", "Fish Goujons","Curried Quorn Wrap"],
            ["Roast Beef, Gravy &amp; Yorkshire Pudding", "Moroccan Chicken","Vegetable &amp; Chickpea stew"],
            ["Chicken Curry","Pork Casserole","Vegetable Frittata"],
            ["Oven Baked Sausages","Breaded Fish","Brocolli Pasta Bake"]
        ],
        3:[
            ["Chicken Chorizo Pasta", "Fish Pie","Quorn, Gravy and Yorkshire Pudding"],
            ["Oven Baked Sausages and Gravy","Savoury Chicken Rice","Vegetable Calzone"],
            ["Steak Pie","Teriyaki Salmon","Vegetable Curry"],
            ["Chicken Nuggets and Dip","Mild Beef Chilli","Macaroni Cheese"],
            ["Sweet n Sour Chicken","Breaded Fish","Cheese and Potato Cake"]
        ],
        4:[
            ["Meatballs in Tomato Sauce","Gammon Steak with Pineapple","Tomato Pasta Bake"],
            ["Chinese Chicken Curry","Jumbo Fish Fingers","Vegeball Wrap"],
            ["Cottage Pie","Creamy Ham Pasta","Vegetable Jambalaya"],
            ["Oven Baked Sausages &amp; Gravy","Sweet Chilli Chicken","Vegetable Nuggets &amp; Dip"],
            ["Chicken Fajita","Breaded Fish","Macaroni Cheese"]
        ]
        
    }
    
};

const taysideMenus = {
    getMenuCard : function(menuArray, date)
    {       // Receives meal array, and simply parses to a list of menu items.
            var card = {};
            card.title = date.toLocaleDateString('en-GB', { weekday: 'long' }) + " School Menu";
            card.text = menuArray.join('\n');
            card.imageObj = {
            smallImageUrl: 'http://www.tayside-contracts.co.uk/_assets/_img/logo.gif',
            largeImageUrl: 'http://www.tayside-contracts.co.uk/_assets/_img/logo.gif'
            };
    return card;
    },
    getMenuWeek : function(req_date){
         var req_monday = new Date(req_date.getTime());
        if (req_date.getDay() !== 1)
        {
            req_monday.setDate(req_date.getDate()-req_date.getDay()+1); // Snap to Monday to find wk.
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
       return req_week;
        
        // Returns a week number (1 to 4)
    }
    
}


const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask',"Hi, you can ask what's for lunch?");
    },
    'getLunchMenu': function(){
        try {
        // START Slot and Variable Handling ************    
            
        // Get Date requested from Slot - default to today. 
        var req_date;
        if ( !this.event.request.intent.slots.Date || this.event.request.intent.slots.Date.value == ''||this.event.request.intent.slots.Date.value == undefined) {
        req_date = new Date();
        console.log("Blank Date Given, using " + req_date.toISOString())
        }
        else{
            req_date = new Date(this.event.request.intent.slots.Date.value);
        }
         if (req_date.getDay() == 0 ||req_date.getDay() == 6){
            this.emit(':ask',"Sorry schools closed at the weekend. Try asking what's for lunch on Monday. I love Mondays!");    
            return;        
            }
            
        this.attributes.req_date = req_date;
        if (this.attributes.school_level){
            var school_level = this.attributes.school_level;
        }
            else{
            if (!this.event.request.intent.slots.school_level || this.event.request.intent.slots.school_level.value == ''||this.event.request.intent.slots.school_level.value == undefined) {
         
         //console.log(this.event.request.intent.slots.school_level.value);
         this.emit(':elicitSlot', "school_level", "Are you at primary or secondary school?", "Do you go to primary school or the high school?");
        }
        else {
            this.attributes.school_level = this.event.request.intent.slots.school_level.resolutions.resolutionsPerAuthority[0].values[0].value.name; 
            var school_level = this.attributes.school_level;
        }
            }
        // END ********* Slot and Variable Handling *****************    
        var req_week = taysideMenus.getMenuWeek(req_date);
        
    if (req_week > 0)
    {

       var mealsArray = menu[school_level][req_week][req_date.getDay()-1];
       // Get meals
        
        // TODO Randomise selections
       var mealString = "You can choose ";
       if (school_level == 'primary'){
           // Slice array to ditch the sandwich.
           mealsArray = mealsArray.slice(0,3);
       }
       else
       {
           // Drop desert. 
       }
       
       for (var i=0;i< mealsArray.length-1;i++)
       {
           mealString = mealString + mealsArray[i] + ", ";
       }
       mealString = mealString + " or a " +  mealsArray[i];
       var menuCard = taysideMenus.getMenuCard(mealsArray, req_date);
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
            console.log(e.message);
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

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.dynamoDBTableName  = 'tayside_dinners_users';    
    alexa.registerHandlers(handlers);
    alexa.execute();

};