/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

let recognition = new p5.SpeechRec();
let bg1 = 0;
let bg2 = 255;
let bg3 = 100;

let computerVoice = new p5.Speech();
let winningMessage = ["Congratulations", "Nice job", "Look who found me", "Somebodies smart", "Took you long enough"];


function preload() {

}


/**
Description of setup
*/
function setup() {
    createCanvas(windowWidth, windowHeight);

    recognition.continuous = true;
    recognition.onResult = handleResult;
    recognition.start();
}


/**
Description of draw()
*/
function draw() {
    background(255);
    // textPlaced();
}


// function textPlaced() {
//     textSize(100);
//     fill(0);
//     text(spoke, 50, 50);
// }


function mousePressed() {
    let play = random(winningMessage);
    computerVoice.speak(play);
}


function handleResult() {
    let spoke = recognition.resultString;
    if(recognition.resultValue) {
        console.log(spoke);
        computerVoice.speak(spoke);
    }


    switch(spoke) {
        case 'pink':
            bg1 = 255;
            bg2 = 16;
            bg3 = 200;
        break;
        case "red":
            bg1 = 255;
            bg2 = 10;
            bg3 = 50;
        break;
        case "purple":
            bg1 = 230;
            bg2 = 200;
            bg3 = 255;
        break;
    }

}