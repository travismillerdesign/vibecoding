precision highp float;

varying vec2 vTexCoord;

uniform vec2 u_resolution;
uniform float u_time;

uniform int u_ripple_count;
uniform vec2 u_ripple_positions[10];
uniform float u_ripple_ages[10];

// Gradient function from Inigo Quilez
vec3 palette( float t, vec3 a, vec3 b, vec3 c, vec3 d ) {
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y; // Flip y-axis for p5.js compatibility

    vec2 p = uv;

    // Apply ripple effects
    for (int i = 0; i < 10; i++) {
        if (i < u_ripple_count) {
            vec2 ripple_pos = u_ripple_positions[i];
            float ripple_age = u_ripple_ages[i];

            float dist = distance(p, ripple_pos);
            float max_dist = ripple_age / 60.0; // Ripple expands over time
            float falloff = 0.1;

            if (dist < max_dist && dist > max_dist - falloff) {
                float ripple_strength = (falloff - (max_dist - dist)) / falloff;
                p += normalize(p - ripple_pos) * ripple_strength * 0.05 * (1.0 - (ripple_age / 120.0)); // Ripple effect diminishes with age
            }
        }
    }

    float t = u_time * 0.5 + p.x * 2.0 + p.y;

    vec3 color = palette(t, vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(1.0, 1.0, 1.0), vec3(0.0, 0.1, 0.2));

    gl_FragColor = vec4(color, 1.0);
}