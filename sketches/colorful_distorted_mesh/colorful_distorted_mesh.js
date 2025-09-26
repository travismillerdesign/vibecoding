let shaderProgram;
let noiseSlider, detailSlider, colorDetailSlider;
let rotXSlider, rotYSlider, rotZSlider;
let speedSlider;
let elements = [];

function preload() {
  shaderProgram = loadShader('sketches/colorful_distorted_mesh/colorful_distorted_mesh.vert', 'sketches/colorful_distorted_mesh/colorful_distorted_mesh.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  let p;

  p = createP('Noise Amount');
  p.position(10, 5);
  p.style('color', 'white');
  elements.push(p);
  noiseSlider = createSlider(0, 250, 100, 1);
  noiseSlider.position(10, 25);
  elements.push(noiseSlider);

  p = createP('Noise Detail');
  p.position(10, 45);
  p.style('color', 'white');
  elements.push(p);
  detailSlider = createSlider(0.001, 0.1, 0.02, 0.001);
  detailSlider.position(10, 65);
  elements.push(detailSlider);

  p = createP('Color Detail');
  p.position(10, 85);
  p.style('color', 'white');
  elements.push(p);
  colorDetailSlider = createSlider(0, 5, 1, 0.1);
  colorDetailSlider.position(10, 105);
  elements.push(colorDetailSlider);

  p = createP('Animation Speed');
  p.position(10, 125);
  p.style('color', 'white');
  elements.push(p);
  speedSlider = createSlider(0, 0.1, 0, 0.001);
  speedSlider.position(10, 145);
  elements.push(speedSlider);

  p = createP('Rotate X');
  p.position(10, 165);
  p.style('color', 'white');
  elements.push(p);
  rotXSlider = createSlider(-PI, PI, PI / 3, 0.01);
  rotXSlider.position(10, 185);
  elements.push(rotXSlider);

  p = createP('Rotate Y');
  p.position(10, 205);
  p.style('color', 'white');
  elements.push(p);
  rotYSlider = createSlider(-PI, PI, PI / 4, 0.01);
  rotYSlider.position(10, 225);
  elements.push(rotYSlider);

  p = createP('Rotate Z');
  p.position(10, 245);
  p.style('color', 'white');
  elements.push(p);
  rotZSlider = createSlider(-PI, PI, 0, 0.01);
  rotZSlider.position(10, 265);
  elements.push(rotZSlider);

  noStroke();
}

function draw() {
  background(50);

  shader(shaderProgram);

  // Pass uniforms to the shader
  shaderProgram.setUniform('u_time', frameCount * speedSlider.value());
  shaderProgram.setUniform('u_noise_amount', noiseSlider.value());
  shaderProgram.setUniform('u_noise_detail', detailSlider.value());
  shaderProgram.setUniform('u_color_detail', colorDetailSlider.value());
  shaderProgram.setUniform('u_resolution', [width, height]);

  // Apply rotation from sliders
  rotateX(rotXSlider.value());
  rotateY(rotYSlider.value());
  rotateZ(rotZSlider.value());

  // Use a plane with enough vertices for detail
  plane(400, 400, 150, 150);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// remove sliders and labels when sketch is changed
function cleanup() {
    for (let i = 0; i < elements.length; i++) {
        elements[i].remove();
    }
    elements = [];
}