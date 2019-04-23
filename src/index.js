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
    // Week in rotation : [Dates of the Monday of that week] 
    1:['29042019','27052019','24062019','19082019','16092019','11112019','09122019','06012020','03022020','02032020','30032020'],
    2:['06052019','03062019','26082019','23092019','21102019','18112019','16122019','13012020','10022020','09032020'],
    3:['15042019','13052019','10062019','02092019','30092019','28102019','26112018','21012019','18022019','18032019'],
    4:['22042019','20052019','17062019','12082019','09092019','04112019','02122019','27012020','24022020','23032020']
};
const menu ={
    primary:{
    // week[(day)[menu options that week - option 1, option 2, veggie_choice, sandwich, desert (or fruit selection)]]
    // [Red Choice, Blue Choice, Green Choice, Yellow Choice, last option (or fruit selection) ]
    1:[     
        ['Chicken in Gravy','Fish Fingers','Quorn Fillet','Cheese Roll'], //Mon
        ['Bolognese Meatballs','Popcorn Chicken','Bolognese Vegeballs','Tuna Mayo Roll'], //Tues
        ['Chinese Rice with Chicken','Sausages','Chinese Rice with Mushrooms','Turkey Sandwich','Sponge with Berry Sauce'], //Wed
        ['Mince with Doughballs','Turkey Burger','Quorn Mince with Doughballs','Chicken Sandwich'], //Thurs
        ['Chicken Curry','Fish Bites','Vegetable Curry','Ham Roll','Cheese and Crackers']
    ],
    2:[
        ['Sausage Roll','Savoury Rice with Chicken','Quorn Cottage Pie','Tuna May Sandwich','Shortbread Biscuit'],
        ['Pork Meatballs with Tomato Sauce','Chicken Nuggets','Chickpea Potato Cake','Cheese Sandwich','Frozen Yoghurt'],
        ['Steak Casserole','Baked Potato with Tuna Mayo','Cheese and Tomato Pizza','Turkey Sandwich'],
        ['Roast Beef, Gravy with Yorkshire Pudding','Chicken Burrito','Macaroni Cheese','Ham Sandwich','Chocolate Sponge'],
        ['Turkey Burger in a Bun','Breaded Fish','Vegetable Noodles','Chicken Mayo Roll']
    ],
    3:[
        ['Chicken Fajita','Hot Dog Roll','Vegetable Fajita','Tuna Mayo Sandwich','Ice Cream with Berry Sauce'],
        ['Chiken in Tomato Sauce with Pasta','Fish Fingers','Quorn in Tomato Sauce with Pasta','Cheese Roll'],
        ['Chicken Mexican Rice','Cheese and Tomato Pizza','Veggie Mexican Rice','Doughnut'],
        ['Tomato Soup','Steak Pie','Quorn Pie','Turkey Sandwich'],
        ['Beef Burger','Baked Potato and Cheese','Veggie Bean Burger','Chicken Sandwich']
        ],
    4:[
        ['Quorn Dog Roll','Cheese and Tomato Pizza','Baked Potato and Baked Beans','Sliced Egg Roll','Chocolate Sponge'], // Mon
        ['Mince and Mashed Potatoes','Fish with Potato Wedges','Quorn Mince with Mashed Potatoes','Ham Finger Roll','Frozen Raspberry Yoghurt'], // Tues
        ['Chicken Sausages','Vegetable Fingers','Macaroni Cheese','Tuna Mayo Sandwich'],//Wed
        ['Chinese Chicken Curry','Lasagne','Chinese Vegetable Curry','Turkey Sandwich','Fruit Salad'],//Thurs
        ['Chicken Burger in a Bun','Fishcake','Cheesy Vegetable Cake','Veggie Rainbow Wrap'] //Fri
        ]
    },// Primary updated for new school year - 2019
    secondary:
    {
        1:[ // Vege still always option 3.
            ["Chicken in Gravy",'Veggie Chow Mein','Quorn Fillet, Gravy and Yorkshire Pudding'], //Mon
            ['Bolognese Meatballs','Hunters Chicken','Bolognese Vegeballs'], //Tue
            ['Chinese Rice with Chicken','Sausages with Gravy','Chinese Rice with Mushrooms'], //Wed
            ['Mince with Doughballs','Macaroni Cheese','Quorn Mince with Doughballs'], //Thurs
            ['Chicken Curry','Breaded Fish', 'Vegetable Curry'] //Fri
        ],
        2:[
            ['Tomato Pasta','Macaroni Cheese','Veggie Enchilada'],
            ['Chinese Chicken Curry','Cottage Pie','Chinese Vegetable Curry'],
            ['Ham Pizza','Chicken Gravy Pie','Cheese and Tomato Pizza'],
            ['Roast Beef, Gravy and Yorkshire Pudding','Chicken Chow Mein','Quorn Fillet, Gravy and Yorkshire Pudding'],
            ['Chicken Rice Jambalaya','Breaded Fish','Vegetable Rice Jambalaya']
        ],
        3:[
            ['Chicken Fajita','Macaroni Cheese','Vegetable Fajita'],
            ["Chicken in Tomato Sauce",'Sausages','Quorn in Tomato Sauce'],
            ['Chicken Mexican Rice','Fish Pie','Veggie Mexican Rice'],
            ['Steak Pie','Creamy Chicken and Sweetcorn Pasta','Quorn Pie'],
            ['Beef Burger','Breaded Fish','Veggie Bean burger in a bun']
        ],
        4:[
            ['Vegetable Nuggets','Cheese Frittata','Quorn Casserole'],
            ['Traditional Mince','Thai Fishcake','Quorn Mince'],
            ['Chicken Sausages','Vegetable Fingers','Macaroni Cheese'],
            ['Chinese Chicken Curry','Lasagne','Chinese Vegetable Curry'],
            ['BBQ Chicken','Breaded Fish','BBQ Beans']
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
