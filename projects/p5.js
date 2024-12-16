let speedx = 2;
let speedy = 2;
let x, y;
let boxY = 120;
let boxX = 200;
let edgePadding = 0;
let dvdLogo;

const colors = ['#FF0000', '#0000FF', '#FFFF00'];
let currentColorIndex = 0;

function preload() {
    dvdLogo = loadImage('assets/dvd-logo.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    x = random(edgePadding + boxX / 2, width - edgePadding - boxX / 2);
    y = random(edgePadding + boxY / 2, height - edgePadding - boxY / 2);
    setColor();
}

function draw() {
    background(0);
    x += speedx;
    y += speedy;
    move();
    rectMode(CENTER);
    noStroke();
    fill(colors[currentColorIndex]);
    rect(x, y, boxX, boxY);
    imageMode(CENTER);
    let logoWidth = boxX * 0.8;
    let logoHeight = boxY * 0.8;
    image(dvdLogo, x, y, logoWidth, logoHeight);
}

function setColor() {
    fill(colors[currentColorIndex]);
}

function move() {
    if (x + boxX / 2 > width - edgePadding) {
        speedx = random(-4, -1);
        nextColor();
    }
    if (x - boxX / 2 < edgePadding) {
        speedx = random(1, 4);
        nextColor();
    }
    if (y + boxY / 2 > height - edgePadding) {
        speedy = random(-4, -1);
        nextColor();
    }
    if (y - boxY / 2 < edgePadding) {
        speedy = random(1, 4);
        nextColor();
    }
}

function nextColor() {
    currentColorIndex = (currentColorIndex + 1) % colors.length;
}
