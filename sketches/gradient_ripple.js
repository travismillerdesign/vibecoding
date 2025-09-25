let simpleShader;
let ripples = [];

function preload() {
  simpleShader = loadShader('sketches/gradient_ripple.vert', 'sketches/gradient_ripple.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  shader(simpleShader);
  simpleShader.setUniform('u_resolution', [width, height]);
}

function draw() {
  simpleShader.setUniform('u_time', frameCount * 0.01);
  simpleShader.setUniform('u_mouse', [mouseX, map(mouseY, 0, height, height, 0)]);

  // Update ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].age += 1;
    if (ripples[i].age > 120) {
      ripples.splice(i, 1);
    }
  }

  // Pass ripples to shader
  let ripplePositions = [];
  let rippleTimes = [];
  for (let i = 0; i < ripples.length; i++) {
    ripplePositions.push(ripples[i].position);
    rippleTimes.push(ripples[i].age);
  }

  simpleShader.setUniform('u_ripple_count', ripples.length);
  if (ripples.length > 0) {
    simpleShader.setUniform('u_ripple_positions', ripplePositions.flat());
    simpleShader.setUniform('u_ripple_ages', rippleTimes);
  }

  rect(0, 0, width, height);
}

function mousePressed() {
  ripples.push({
    position: [mouseX / width, 1.0 - mouseY / height],
    age: 0
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  simpleShader.setUniform('u_resolution', [width, height]);
}