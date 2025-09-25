function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
}

function draw() {
  // Draw a circle at the mouse position
  noStroke();
  fill(255, 255, 0, 50); // Yellow with some transparency
  ellipse(mouseX, mouseY, 50, 50);
}

function mousePressed() {
  // Change the background color when the mouse is pressed
  background(random(255), random(255), random(255));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(100); // Reset background on resize
}