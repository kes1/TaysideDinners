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

const APP_ID = ''  //APP_ID here. 

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
    30112017 : ['Corned Beef Stovies'], // These replace red choice.  Don't see any for 2018/19?
    25012018 : ['Haggis']
};

const weeks = {
    // Week in rotation : [Dates of the Saturday of that week] 
    1:['30042018','28052018','25062018','20082018','17092018','15102018','12112018','10122018','07012019','04022019','04032019'],
    2:['07052018','04062018','27082018','24092018','22102018','19112018','17122018','14012019','11022019','11032019'],
    3:['16042018','14052018','11062018','03092018','01102018','29102018','26112018','21012019','18022019','18032019'],
    4:['23042018','21052018','18062018','13082018','10092018','05112018','03122018','28012019','25022019','25032019']
};
const menu ={
    primary:{
    // week[(day)[menu options that week - option 1, option 2, veggie_choice, sandwich, desert (or fruit selection)]]
    // [Red Choice, Blue Choice, Green Choice, Yellow Choice, last option (or fruit selection) ]
    1:[     
        ['Creamy Chicken Pie','Fish Fingers','Tomato Pasta','Cheese Sandwich'], //Mon
        ['Chinese Chicken Curry','Homemade Salmon Fishcake','Cheese and Tomato Pizza','Ham Roll'], //Tues
        ['Cottage Pie','Chicken Noodles','Macaroni Cheese','Tuna Mayo Sandwich','Tiffin'], //Wed
        ['Sausages','Baked Potato with Beans','Vegetable Curry','Hummus and Red Pepper Wrap'], //Thurs
        ['Beef Burger in a bun','Breaded Fish','Chinese Style Rice with Mushrooms','Turkey Sandwich','Banana and Chocolate Sponge']
    ],
    2:[
        ['Sausage Roll','Savoury Rice with Chicken','Quorn Cottage Pie','Tuna May Sandwich','Shortbread Biscuit'],
        ['Pork Meatballs with Tomato Sauce','Chicken Nuggets','Chickpea Potato Cake','Cheese Sandwich','Frozen Yoghurt'],
        ['Steak Casserole','Baked Potato with Tuna Mayo','Cheese and Tomato Pizza','Turkey Sandwich'],
        ['Roast Beef, Gravy with Yorkshire Pudding','Chicken Burrito','Macaroni Cheese','Ham Sandwich','Chocolate Sponge'],
        ['Turkey Burger in a Bun','Breaded Fish','Vegetable Noodles','Chicken Mayo Roll']
    ],
    3:[
        ['Chicken Casserole','Fish Fingers','Quorn Tortilla Lasagne','Cheese Sandwich','Ice cream with Berry Sauce'],
        ['Ham Ommelette','Chicken Curry','Cheese and Tomato Pizza','Roast Beef Sandwich'],
        ['Sausages with Gravy','Baked Potato with Beef Chilli','Broccoli Pasta Bake','Tuna Mayo Sandwich'],
        ['Chicken Nuggets','Minced Beef','Vegetable Bean Burger in a bun','Ham Sandwich'],
        ['Beef Burger in a Bun','Fish Goujons','Quorn Sausages in Gravy','Turkey Sandwich','Oat and Apple Muffin']
        ],
    4:[
        ['Sweet and Sour Chicken','Fish Fingers','Quorn Dog Roll','Cheese Sandwich','Frozen Yoghurt'], // Mon
        ['Chicken, Gravy with Yorkshiire Pudding','Meatballs in a Moroccan Sauce','Macaroni Cheese','Turkey Sandwich','Jelly and Fruit'], // Tues
        ['Steak Pie','Chicken Biryani','Cheese and Tomato Pizza','Ham Sandwich'],//Wed
        ['Spaghetti Bolognese','Breaded Fish','Vegetable Omelette','Tuna Mayo Sandwich','Golden Crunch'],//Thurs
        ['Chicken Burger in a Bun','Baked Potato with Tuna Mayo','Chilli Quorn Burrito','Chicken Sandwich', 'Cheese and Crackers'] //Fri
        ]
    },// Primary updated for new school year - 2018
    secondary:
    {
        1:[ // Vege still always option 3.
            ["Creamy Chicken Pie",'Fish Fingers','Tomato Pasta'], //Mon
            ['Chinese Chicken Curry','Homemade Salmon Fishcake','Vegetable Calzone'], //Tue
            ['Cottage Pie','Chicken Chow Mein','Macaroni Cheese'], //Wed
            ['Sausages','Moroccan Chicken','Vegetable Curry'], //Thurs
            ['Chicken Lasagne','Breaded Fish'] //Fri
        ],
        2:[
            ['Pork Steak with Onion Gravy','Savoury Rice with Chicken','Quorn Cottage Pie'],
            ['Chicken Tikka Masala','Pork Meatballs in Tomato Sauce','Chickpea Potato Cake'],
            ['Steak Casserole','Scampi','Mexicorn Omelette'],
            ['Roast Beef, Gravy and Yorkshire Pudding','Chicken Burrito','Macaroni Cheese'],
            ['Sweet Chilli Chicken','Breaded Fish','Vegetable Chow Mein']
        ],
        3:[
            ['Chicken Chorizo Pasta','Fish Fingers','Quorn Tortilla Lasagne'],
            ["Ham Fritatta",'Chicken Curry','Vegetable Calzone'],
            ['Sausages in Gravy','Beef Chilli','Broccoli Pasta Bake'],
            ['Hunters Chicken','Minced Beef','Homemade Bean Burger Roll'],
            ['Spaghetti Carbonara','Breaded Fish','Quorn Sausages in Gravy']
        ],
        4:[
            ['Sweet and Sour Chicken','Fish Fingers','Veggie Sweet Chilli Noodles'],
            ['Chicken, Gravy and Yorkshire','Pork Meatballs in Moroccan Sauce','Macaroni Cheese'],
            ['Steak Pie','Chicken Biryani','Roasted Pepper Calzone'],
            ['Bolognese Mince','Breaded Fish','Vegetable Omelette'],
            ['Gammon Steak and Pineapple','Piri Piri Chicken Stir Fly','Chilli Quorn Burrito']
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
        //this.emit(':tell',"We are updating our menus for the new term, please try again after the holidays.");
        //return;
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
           this.emit(':ask', "Sorry I couldn't find a meal for that date, are you sure it's a school day?", "Try asking what's for lunch on Monday?");
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
