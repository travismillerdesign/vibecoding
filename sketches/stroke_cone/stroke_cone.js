// UI-controlled parameters (sensible defaults)
let rotateX = 1.0;
let rotateY = 0.0;
let rotateZ = 0.0;
let depth = 220.0;
let rimRadius = 220.0;
let amplitude = 60.0;
let curveWeight = 0.5;
let petalCount = 180;
let segmentCount = 4;
let edgeNoise = 0.0;
let noiseScale = 0.08;
let irregularity = 0;
let petalBumps = 5;

let exporting = false;

// Sliders
let rotateXSlider, rotateYSlider, rotateZSlider, rimRadiusSlider, depthSlider,
    amplitudeSlider, curveWeightSlider, petalCountSlider, segmentCountSlider,
    edgeNoiseSlider, noiseScaleSlider, irregularitySlider, petalBumpsSlider;

function setup() {
  createCanvas(1000, 1000, SVG);
  smooth(8);
  noiseSeed(25);
  noiseDetail(1);

  // Create a container for the UI elements
  const uiContainer = createDiv().id('ui-container').style('position', 'absolute').style('top', '10px').style('left', '10px');

  // Create sliders and labels
  const createSliderWithLabel = (label, min, max, value, step, parent) => {
    const wrapper = createDiv().parent(parent).style('margin-bottom', '5px');
    const labelP = createP(label).parent(wrapper).style('margin', '0').style('display', 'inline-block').style('width', '120px');
    const slider = createSlider(min, max, value, step).parent(wrapper);
    return slider;
  };

  rotateXSlider = createSliderWithLabel("rotateX", -PI / 2, PI / 2, rotateX, 0.01, uiContainer);
  rotateYSlider = createSliderWithLabel("rotateY", -PI / 2, PI / 2, rotateY, 0.01, uiContainer);
  rotateZSlider = createSliderWithLabel("rotateZ", -PI, PI, rotateZ, 0.01, uiContainer);
  rimRadiusSlider = createSliderWithLabel("rimRadius", 10, 700, rimRadius, 1, uiContainer);
  depthSlider = createSliderWithLabel("depth", 0, 500, depth, 1, uiContainer);
  amplitudeSlider = createSliderWithLabel("amplitude", -400, 400, amplitude, 1, uiContainer);
  curveWeightSlider = createSliderWithLabel("curveWeight", 0, 1, curveWeight, 0.01, uiContainer);
  petalCountSlider = createSliderWithLabel("petalCount", 3, 500, petalCount, 1, uiContainer);
  segmentCountSlider = createSliderWithLabel("segmentCount", 1, 10, segmentCount, 1, uiContainer);
  edgeNoiseSlider = createSliderWithLabel("edgeNoise", 0, 200, edgeNoise, 1, uiContainer);
  noiseScaleSlider = createSliderWithLabel("noiseScale", 0, 10, noiseScale, 0.01, uiContainer);
  irregularitySlider = createSliderWithLabel("irregularity", 0, 1, irregularity, 0.01, uiContainer);
  petalBumpsSlider = createSliderWithLabel("petalBumps", 0, 12, petalBumps, 1, uiContainer);

  const exportButton = createButton("Export SVG").parent(uiContainer);
  exportButton.mousePressed(exportSVG);
}

function draw() {
  // Read UI each frame
  rotateX = rotateXSlider.value();
  rotateY = rotateYSlider.value();
  rotateZ = rotateZSlider.value();
  rimRadius = rimRadiusSlider.value();
  depth = depthSlider.value();
  amplitude = amplitudeSlider.value();
  curveWeight = curveWeightSlider.value();
  petalCount = max(3, round(petalCountSlider.value()));
  segmentCount = max(1, round(segmentCountSlider.value()));
  edgeNoise = edgeNoiseSlider.value();
  noiseScale = noiseScaleSlider.value();
  irregularity = irregularitySlider.value();
  petalBumps = round(petalBumpsSlider.value());

  if (exporting) {
    // In P5.js SVG, save() triggers the download.
    // The drawing happens in the main draw loop.
    // We'll just call save() and let it capture the current frame.
    save("flower_output.svg");
    exporting = false;
    console.log("Export complete: flower_output.svg");
  }

  // On-screen draw
  background(255);
  drawFlower();
}

function drawFlower() {
  push();
  translate(width * 0.5, height * 0.75 - 10);

  strokeWeight(1.5);
  noFill();

  const apex = createVector(0, 0, 0);
  const axis = createVector(0, 0, 1);

  for (let i = 0; i < petalCount; i++) {
    let theta = TWO_PI * i / petalCount;
    theta += irregularity * noise(i);

    let localR = depth;
    let localRimRadius = rimRadius;
    if (edgeNoise > 0.0001) {
      const n = noise(sin(theta) * noiseScale + 37.123);
      localR += map(n, 0, 1, 0, edgeNoise);
      localRimRadius += map(n, 0, 1, 0, edgeNoise);
      localRimRadius += edgeNoise * abs(sin(theta * petalBumps));
    }

    const rimModel = createVector(localRimRadius * cos(theta), localRimRadius * sin(theta), depth + localR);
    const midModel = p5.Vector.lerp(apex, rimModel, curveWeight);
    const radial = p5.Vector.sub(rimModel, apex);
    if (radial.mag() === 0) radial.set(1, 0, 0);

    const temp = p5.Vector.cross(axis, radial);
    const normalModel = p5.Vector.cross(temp, radial);
    normalModel.normalize();

    const ctrlModel = p5.Vector.add(midModel, p5.Vector.mult(normalModel, amplitude));

    const rimWorld = rotatePoint3D(rimModel, rotateX, rotateY, rotateZ);
    const ctrlWorld = rotatePoint3D(ctrlModel, rotateX, rotateY, rotateZ);
    const apexWorld = rotatePoint3D(apex, rotateX, rotateY, rotateZ);

    const a2 = createVector(apexWorld.x, apexWorld.y);
    const c2 = createVector(ctrlWorld.x, ctrlWorld.y);
    const r2 = createVector(rimWorld.x, rimWorld.y);

    for (let s = 0; s < segmentCount; s++) {
      const t0 = s / segmentCount;
      const t1 = (s + 1) / segmentCount;
      const tm = (t0 + t1) * 0.5;

      const P0 = quadPoint2D(a2, c2, r2, t0);
      const Pm = quadPoint2D(a2, c2, r2, tm);
      const P2 = quadPoint2D(a2, c2, r2, t1);

      const Cp = p5.Vector.sub(p5.Vector.mult(Pm, 2.0), p5.Vector.mult(p5.Vector.add(P0, P2), 0.5));
      const cubicC1 = p5.Vector.add(P0, p5.Vector.mult(p5.Vector.sub(Cp, P0), 2.0 / 3.0));
      const cubicC2 = p5.Vector.add(P2, p5.Vector.mult(p5.Vector.sub(Cp, P2), 2.0 / 3.0));

      const hue = (s * 40) % 128;
      // Original logic produced a greyscale color because saturation was 0.
      // The brightness was based on the hue value (from 0 to 127).
      const brightness = constrain(hue / 100.0, 0, 1);
      const grayValue = brightness * 255;
      stroke(grayValue);

      bezier(P0.x, P0.y, cubicC1.x, cubicC1.y, cubicC2.x, cubicC2.y, P2.x, P2.y);
    }
  }

  pop();
}

function rotatePoint3D(p, ax, ay, az) {
  let x = p.x;
  let y = p.y;
  let z = p.z;

  // rotate X
  const cosx = cos(ax), sinx = sin(ax);
  const y1 = y * cosx - z * sinx;
  const z1 = y * sinx + z * cosx;
  y = y1; z = z1;

  // rotate Y
  const cosy = cos(ay), siny = sin(ay);
  const x1 = x * cosy + z * siny;
  const z2 = -x * siny + z * cosy;
  x = x1; z = z2;

  // rotate Z
  const cosz = cos(az), sinz = sin(az);
  const x2 = x * cosz - y * sinz;
  const y2 = x * sinz + y * cosz;
  x = x2; y = y2;

  return createVector(x, y, z);
}

function quadPoint2D(A, B, C, t) {
  const u = 1.0 - t;
  const x = u * u * A.x + 2 * u * t * B.x + t * t * C.x;
  const y = u * u * A.y + 2 * u * t * B.y + t * t * C.y;
  return createVector(x, y);
}

function exportSVG() {
  exporting = true;
}