let shaderProgram;
let distortionAmplitudeSlider, noiseScaleSlider, colorNoiseScaleSlider, animSpeedSlider, octavesSlider, meshDivisionsSlider, colorAmplitudeSlider;
let rotXSlider, rotYSlider, rotZSlider;
let distortionAmplitudeLabel, noiseScaleLabel, colorNoiseScaleLabel, animSpeedLabel, octavesLabel, meshDivisionsLabel, colorAmplitudeLabel;
let rotXLabel, rotYLabel, rotZLabel;

function preload() {
  shaderProgram = loadShader('sketches/colorful_distorted_mesh/colorful_distorted_mesh.vert', 'sketches/colorful_distorted_mesh/colorful_distorted_mesh.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // --- UI ---
  let currentY = 10;
  const sliderWidth = '200px';
  const yStep = 50;

  // Animation Speed
  animSpeedLabel = createDiv('Animation Speed').position(10, currentY).style('color', 'white');
  animSpeedSlider = createSlider(0, 0.01, 0, 0.001).position(10, currentY += 20).style('width', sliderWidth);
  currentY += yStep;

  // Distortion Amplitude
  distortionAmplitudeLabel = createDiv('Distortion Amplitude').position(10, currentY).style('color', 'white');
  distortionAmplitudeSlider = createSlider(0, 200, 100, 1).position(10, currentY += 20).style('width', sliderWidth);
  currentY += yStep;

  // Noise Scale
  noiseScaleLabel = createDiv('Noise Scale').position(10, currentY).style('color', 'white');
  noiseScaleSlider = createSlider(0.001, 2.0, 1.0, 0.001).position(10, currentY += 20).style('width', sliderWidth);
  currentY += yStep;

  // Noise Octaves
  octavesLabel = createDiv('Noise Octaves').position(10, currentY).style('color', 'white');
  octavesSlider = createSlider(1, 8, 4, 1).position(10, currentY += 20).style('width', sliderWidth);
  currentY += yStep;

  // Color Noise Scale
  colorNoiseScaleLabel = createDiv('Color Noise Scale').position(10, currentY).style('color', 'white');
  colorNoiseScaleSlider = createSlider(0.001, 10.0, 1, 0.001).position(10, currentY += 20).style('width', sliderWidth);
  currentY += yStep;

  // Color Amplitude
  colorAmplitudeLabel = createDiv('Color Amplitude').position(10, currentY).style('color', 'white');
  colorAmplitudeSlider = createSlider(0, 1, 0.1, 0.01).position(10, currentY += 20).style('width', sliderWidth);
  currentY += yStep;

  // Mesh Divisions
  meshDivisionsLabel = createDiv('Mesh Divisions').position(10, currentY).style('color', 'white');
  meshDivisionsSlider = createSlider(1, 200, 100, 1).position(10, currentY += 20).style('width', sliderWidth);
  currentY += yStep;

  // Rotation X
  rotXLabel = createDiv('Rotate X').position(10, currentY).style('color', 'white');
  rotXSlider = createSlider(-PI, PI, PI / 3, 0.01).position(10, currentY += 20).style('width', sliderWidth);
  currentY += yStep;

  // Rotation Y
  rotYLabel = createDiv('Rotate Y').position(10, currentY).style('color', 'white');
  rotYSlider = createSlider(-PI, PI, 0, 0.01).position(10, currentY += 20).style('width', sliderWidth);
  currentY += yStep;

  // Rotation Z
  rotZLabel = createDiv('Rotate Z').position(10, currentY).style('color', 'white');
  rotZSlider = createSlider(-PI, PI, PI / 6, 0.01).position(10, currentY += 20).style('width', sliderWidth);

  noStroke();
}

function draw() {
  background(50);

  shader(shaderProgram);

  // Pass uniforms to the shader
  shaderProgram.setUniform('u_time', frameCount);
  shaderProgram.setUniform('u_anim_speed', animSpeedSlider.value());
  shaderProgram.setUniform('u_distortion_amplitude', distortionAmplitudeSlider.value());
  shaderProgram.setUniform('u_noise_scale', noiseScaleSlider.value());
  shaderProgram.setUniform('u_octaves', octavesSlider.value());
  shaderProgram.setUniform('u_color_noise_scale', colorNoiseScaleSlider.value());
  shaderProgram.setUniform('u_color_amplitude', colorAmplitudeSlider.value());
  shaderProgram.setUniform('u_resolution', [width, height]);

  // Apply rotation from sliders
  rotateX(rotXSlider.value());
  rotateY(rotYSlider.value());
  rotateZ(rotZSlider.value());

  // Draw a plane with enough vertices for detail
  let meshDivisions = meshDivisionsSlider.value();
  plane(400, 400, meshDivisions, meshDivisions);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// remove sliders and labels when sketch is changed
function cleanup() {
    animSpeedSlider.remove();
    distortionAmplitudeSlider.remove();
    noiseScaleSlider.remove();
    octavesSlider.remove();
    colorNoiseScaleSlider.remove();
    colorAmplitudeSlider.remove();
    meshDivisionsSlider.remove();
    rotXSlider.remove();
    rotYSlider.remove();
    rotZSlider.remove();

    animSpeedLabel.remove();
    distortionAmplitudeLabel.remove();
    noiseScaleLabel.remove();
    octavesLabel.remove();
    colorNoiseScaleLabel.remove();
    colorAmplitudeLabel.remove();
    meshDivisionsLabel.remove();
    rotXLabel.remove();
    rotYLabel.remove();
    rotZLabel.remove();
}