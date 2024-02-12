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
}

let insultList;
let recognition = new p5.SpeechRec();
let computerVoice = new p5.Speech();
let speaking = 'speak to me';
// let ending = ["duh", "ding dong", "ding-a-ling", "duh duh duh", "doy", "stupid", "says the knucklehead McSpazatron", "says the doofus", "stink face", "duh-doy", "hahaha", "fart"];
// let quips = ["if i had arms i'd give you a swirly", "give me your lunch money", "did you just blow in from stupid town", "you sound like a muppet"];
// let insults = ["if your eyes were any further apart, you'd be an herbivore", "you are the human equivalency of Internet Explorer", "you have a face for radio", "yo mama's so fat she wakes up in sections", "you remind me of C code, no class"];

function preload() {
    insultList = loadJSON("assets/data/insults.json")
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
    let interruption = random(1,5);
    
    if(recognition.resultValue) { 
        if(spoke.startsWith("i'm ") || spoke.startsWith("i am ")) {
            let newSentence = spoke.slice(spoke.indexOf(" ") + 1);
            computerVoice.speak("hello " + newSentence + ", i am your computer bully");
            speaking = "hello " + newSentence + ", i am your computer bully";
            console.log(spoke.indexOf(" ") + 1);
        }
        else if(spoke.startsWith("your ") || spoke.startsWith("you're ") || spoke.startsWith("you are ") || spoke.startsWith("you ")) {
            let comeback = spoke.slice(spoke.indexOf(" ") + 1);
            computerVoice.speak("yo mama " + comeback);
            speaking = "yo mama " + comeback;
        }
        else if(interruption > 4) {
            let chosenQuip = random(insultList.quips);
            computerVoice.speak(chosenQuip);
            speaking = chosenQuip;
        }
        else {
            let chosenEnding = random(insultList.ending);
            console.log(spoke);
            console.log(interruption);
            computerVoice.speak(spoke + ", " + chosenEnding);
            speaking = spoke + ", " + chosenEnding;
        }
    }
}


function mousePressed() {
    let insultPicked = random(insultList.jokes);
    computerVoice.speak(insultPicked);
    speaking = insultPicked;
}