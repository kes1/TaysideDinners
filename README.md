# Tayside Dinners
An Alexa Skill to find out what's for lunch in Tayside schools.

This is a simple app to show what you can do when re-using data about the city's services. 

## How to use it on your alexa
You can install [the skill from the Amazon Store](https://www.amazon.co.uk/dp/B074R5X41G/).  _Now updated with 2018/19 school menus_. 

## How it works

The Alexa Voice skill was authored in [Alexa Skill Kit](https://developer.amazon.com/alexa-skills-kit) with the intents and utterances in the speechAssets folder.  

The menu items are returned from an AWS Lambda microservice on node.js.

The school menu runs for 12 months on a 4 week rotation, so the dates and menu items are currently saved in the lambda skill.  Menu information courtesy of [Tayside Contracts](http://www.tayside-contracts.co.uk/school-catering.cfm) who deliver school catering across Perth & Kinross, Dundee, and Angus.

## Want to try your own?

We've licenced this skill under the AGPL licence, feel free to take it as an example and play.  

There'll be lots more data and examples like this coming to our data platform this October so thinking caps on. :bulb:

Pull requests welcome!

Skill developed by [kes1](https://github.com/kes1/) with data from [@opendundee](https://twitter.com/opendundee).
