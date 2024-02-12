/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

let robotHead = {
    x: 350,
    y: 300,
    width: 500,
    height: 400,
    fill: 180 
};

let robotMouth = {
    x: 350,
    y: 400,
    width: 350,
    height: 100,
    fill: {
        r: 255,
        g: 255,
        b: 191,
    },
};

let robotEyes = {
    x: 250,
    y: 200,
    size: 100,
    fill: 255
};

let robotPupils = {
    x: 250, 
    y: 200, 
    size: 20, 
    fill: 0
};

let robotAntenna = {
    x: 350, 
    y: 75, 
    width: 20, 
    height: 50, 
    size: 30, 
    fill: 180, 
};

let insultList;
let speaking = 'speak to me';
let numLine = 1;

const recognition = new p5.SpeechRec();
const computerVoice = new p5.Speech();
const commands = [
    {
        "command": ["shut up", "shut your mouth", "stop talking", "shush", "shut it"],
        "callback": shutUpResponse
    },
    {
        "command": ["how are you", "how is it going", "how's it going", "how are you feeling", "how do you feel", "how's the weather", "what's up", "what is up", "how's your day going", "how is your day going"],
        "callback": howResponse
    },
    {
        "command": ["who are you", "who made you", "what are you", "why are you like this", "what's your story", "why are you so mean", "why do you do this"],
        "callback": originStory
    }
];

function preload() {
    insultList = loadJSON("assets/data/insults.json");
}


/**
Description of setup
*/
function setup() {
    createCanvas(700, 700);

    recognition.continuous = true;
    recognition.onResult = handleResult;
    recognition.start();
    console.log(computerVoice.listVoices());
    computerVoice.setVoice("Google UK English Male");
    computerVoice.onStart = robotSpoke;
    computerVoice.onEnd = robotDone;

}


/**
Description of draw()
*/
function draw() {
    background(255);
    textDisplay();
    displayRobot();
}


function textDisplay() {
    textAlign(CENTER);
    textSize(30);
    fill(0);
    text(speaking, 350, 600);
}


function displayRobot() {
    let x1 = map(mouseX, 0, width, 235, 265);
    let x2 = map(mouseX, 0, width, 435, 465);
    let y1 = map(mouseY, 0, height, 175, 225);
    
    rectMode(CENTER);
    fill(robotHead.fill);
    rect(robotHead.x, robotHead.y, robotHead.width, robotHead.height);
    rect(robotAntenna.x, robotAntenna.y, robotAntenna.width, robotAntenna.height);
    fill(robotMouth.fill.r, robotMouth.fill.g, robotMouth.fill.b);
    rect(robotMouth.x, robotMouth.y, robotMouth.width, robotMouth.height);
    fill(robotEyes.fill);
    ellipse(robotEyes.x, robotEyes.y, robotEyes.size);
    ellipse(robotEyes.x + 200, robotEyes.y, robotEyes.size);
    fill(robotPupils.fill);
    ellipse(x1, y1, robotPupils.size);
    ellipse(x2, y1, robotPupils.size);
    fill(robotAntenna.fill);
    ellipse(robotAntenna.x, robotAntenna.y - 35, robotAntenna.size);
}


function robotSpoke() {
    robotMouth.fill.r = 255;
    robotMouth.fill.g = 255;
    robotMouth.fill.b = 30;
}

function robotDone() {
    robotMouth.fill.r = 255;
    robotMouth.fill.g = 255;
    robotMouth.fill.b = 191;  
}

function handleResult() {
    let spoke = recognition.resultString.toLowerCase();
    let interruption = Math.round(random(0,5));
    
    if(recognition.resultValue) { 
        for(let command of commands) {
            for(let i = 0; i < command.command.length; i++) {
                if(spoke === command.command[i]){
                    command.callback();
                    break;
                }
            }
        }
        if(spoke.startsWith("i'm ")) {
            let newSentence = spoke.slice(spoke.indexOf("i'm ") + 3);
            computerVoice.speak("hello" + newSentence + ", i am your computer bully");
            speaking = "hello" + newSentence + ", i am your computer bully";
        }
        else if(spoke.startsWith("i am ")) {
            let newSentence2 = spoke.slice(spoke.indexOf("i am ") + 4);
            computerVoice.speak("hello" + newSentence2 + ", i am your computer bully");
            speaking = "hello" + newSentence2 + ", i am your computer bully";
        }
        else if(spoke.startsWith("you are ")) {
            let comeback = spoke.slice(spoke.indexOf(" ") + 4);
            computerVoice.speak("yo mama " + comeback);
            speaking = "yo mama " + comeback;
        }
        else if(spoke.startsWith("your ") || spoke.startsWith("you're ") || spoke.startsWith("you ")) {
            let comeback = spoke.slice(spoke.indexOf(" ") + 1);
            computerVoice.speak("yo mama " + comeback);
            speaking = "yo mama " + comeback;
        }
        else if(spoke.startsWith("why ")) {
            let chosenInsult = random(insultList.jokes);
            computerVoice.speak("because " + chosenInsult);
            speaking = "because " + chosenInsult;
        }
        else if(interruption == 4) {
            let chosenQuip = random(insultList.quips);
            computerVoice.speak(chosenQuip);
            speaking = chosenQuip;
        }
        else {
            let chosenEnding = random(insultList.ending);
            console.log(interruption);
            computerVoice.speak(spoke + ", " + chosenEnding);
            speaking = spoke + ", " + chosenEnding;
        }
        console.log(spoke);
    }
}


function shutUpResponse() {
    let chosenResponse = random(insultList.response);
    computerVoice.speak(chosenResponse);
    speaking = chosenResponse;
}


function howResponse() {
    let chosenFeeling = random(insultList.feelings);
    computerVoice.speak(chosenFeeling);
    speaking = chosenFeeling;
}


function originStory() {
    numLine = 1;
    if(numLine == 1) {
        let line1 = random(insultList.beginning);
        computerVoice.speak(line1);
        speaking = line1;
        numLine = 2;
    }
    else if(numLine == 2) {
        let line2 = random(insultList.middle);
        computerVoice.speak(line2);
        speaking = line2;
        numLine = 3;
    }
    else if(numLine == 3) {
        let line3 = random(insultList.end);
        computerVoice.speak(line3);
        speaking = line3;
        numLine = 0;
    }
}


function mousePressed() {
    let insultPicked = random(insultList.jokes);
    computerVoice.speak(insultPicked);
    speaking = insultPicked;
}