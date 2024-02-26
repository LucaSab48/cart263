/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

let audioContext;
let mic;
let pitch;

async function setup() {
  audioContext = new AudioContext();
  stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  startPitch(stream, audioContext);
}
setup();

function startPitch(stream, audioContext) {
  pitch = ml5.pitchDetection('./model/', audioContext , stream, modelLoaded);
}

function modelLoaded() {
  document.querySelector('#status').textContent='Model Loaded';
  getPitch();
}

function getPitch() {
  pitch.getPitch(function(err, frequency) {
    if (frequency) {
      document.querySelector('#result').textContent = frequency;
    } else {
      document.querySelector('#result').textContent = 'No pitch detected';
    }
    getPitch();
  })
}