let shaderProgram;
let noiseSlider, detailSlider, colorDetailSlider;
let rotXSlider, rotYSlider, rotZSlider;
let noiseLabel, detailLabel, colorDetailLabel;
let rotXLabel, rotYLabel, rotZLabel;

function preload() {
  shaderProgram = loadShader('sketches/colorful_distorted_mesh/colorful_distorted_mesh.vert', 'sketches/colorful_distorted_mesh/colorful_distorted_mesh.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Create sliders and labels for noise and color
  noiseLabel = createDiv('Noise Amount');
  noiseLabel.position(10, 10).style('color', 'white');
  noiseSlider = createSlider(0, 200, 50, 1).position(10, 30).style('width', '200px');

  detailLabel = createDiv('Noise Detail');
  detailLabel.position(10, 60).style('color', 'white');
  detailSlider = createSlider(0.001, 0.1, 0.02, 0.001).position(10, 80).style('width', '200px');

  colorDetailLabel = createDiv('Color Detail');
  colorDetailLabel.position(10, 110).style('color', 'white');
  colorDetailSlider = createSlider(0, 5, 1, 0.1).position(10, 130).style('width', '200px');

  // Create sliders and labels for rotation
  rotXLabel = createDiv('Rotate X');
  rotXLabel.position(10, 160).style('color', 'white');
  rotXSlider = createSlider(-PI, PI, PI / 3, 0.01).position(10, 180).style('width', '200px');

  rotYLabel = createDiv('Rotate Y');
  rotYLabel.position(10, 210).style('color', 'white');
  rotYSlider = createSlider(-PI, PI, 0, 0.01).position(10, 230).style('width', '200px');

  rotZLabel = createDiv('Rotate Z');
  rotZLabel.position(10, 260).style('color', 'white');
  rotZSlider = createSlider(-PI, PI, PI / 6, 0.01).position(10, 280).style('width', '200px');

  noStroke();
}

function draw() {
  background(50);

  shader(shaderProgram);

  // Pass uniforms to the shader
  shaderProgram.setUniform('u_time', frameCount * 0.01);
  shaderProgram.setUniform('u_noise_amount', noiseSlider.value());
  shaderProgram.setUniform('u_noise_detail', detailSlider.value());
  shaderProgram.setUniform('u_color_detail', colorDetailSlider.value());
  shaderProgram.setUniform('u_resolution', [width, height]);

  // Apply rotation from sliders
  rotateX(rotXSlider.value());
  rotateY(rotYSlider.value());
  rotateZ(rotZSlider.value());

  // Draw a plane with enough vertices for detail
  plane(400, 400, 100, 100);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// remove sliders and labels when sketch is changed
function cleanup() {
    noiseSlider.remove();
    detailSlider.remove();
    colorDetailSlider.remove();
    rotXSlider.remove();
    rotYSlider.remove();
    rotZSlider.remove();
    noiseLabel.remove();
    detailLabel.remove();
    colorDetailLabel.remove();
    rotXLabel.remove();
    rotYLabel.remove();
    rotZLabel.remove();
}