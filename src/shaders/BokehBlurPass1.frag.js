// Based on https://www.shadertoy.com/view/4lVfDt by battlebottle

export default /* glsl */`
precision highp float;

#define PI          3.14
#define TWO_PI      6.28
#define MAX_SAMPLES 28.0

uniform sampler2D tMap;
uniform float uScale;
uniform vec2 uResolution;

varying vec2 vUv;

const float blurRadMax = 0.08;
const float blurCircles = 4.0;

void main() {
    float blurRadius = blurRadMax * uScale;

    float totalSamples = 0.0;
    vec3 colAcum = vec3(0.0);

    for (float currentCircle = 0.0; currentCircle < blurCircles; currentCircle++) {
        float samplesForCurrentCircle = (pow(currentCircle + 1.0, 2.0) - pow(currentCircle, 2.0)) * 4.0;
        float currentRadius = (blurRadius / blurCircles) * (currentCircle + 0.5);

        for (float currentSample = 0.0; currentSample < MAX_SAMPLES; currentSample++) {
            if (currentSample >= samplesForCurrentCircle) break;

            vec2 samplePoint = vec2(0.0, currentRadius);
            float angle = TWO_PI * ((currentSample + 0.5) / samplesForCurrentCircle);

            float s = sin(angle);
            float c = cos(angle);
            mat2 m = mat2(c, -s, s, c);
            samplePoint = m * samplePoint;

            samplePoint *= vec2(uResolution.y / uResolution.x, 1.0);

            totalSamples++;
            colAcum += texture2D(tMap, vUv + samplePoint, blurRadius * 30.0).rgb;
        }
    }

    gl_FragColor = vec4(colAcum / totalSamples, 1.0);
}
`;
