import { useEffect, useRef, useState } from 'react'

const vsSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const fsSource = `
  precision highp float;

  uniform vec2 iResolution;
  uniform float iTime;
  uniform float u_speed;
  uniform float u_octaves;
  uniform float u_scale;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p) * fract(p) * (3.0 - 2.0 * fract(p));
    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    float freq = u_scale;
    for (int i = 0; i < 6; i++) {
      if (float(i) >= u_octaves) break;
      v += amp * noise(p * freq);
      freq *= 2.0;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution) / iResolution.y;
    uv.x += iTime * u_speed * 0.2;

    float h = fbm(uv * 1.5);

    // Paleta dopasowana do palety aplikacji (pastelowa zieleń -> biel).
    vec3 sky = mix(vec3(0.55, 0.70, 0.58), vec3(0.93, 0.96, 0.93), uv.y + 0.5);

    float m = smoothstep(h - 0.01, h, uv.y + 0.2);
    vec3 mountain = mix(vec3(0.10, 0.28, 0.14), vec3(0.30, 0.50, 0.32), h);
    vec3 color = mix(sky, mountain, m);

    vec2 sunPos = vec2(0.0, 0.3);
    float dist = length(uv - sunPos);
    vec3 sun = vec3(0.97, 1.0, 0.93) * (0.05 / dist);
    color += sun;

    color = mix(color, sky, smoothstep(0.3, 1.5, uv.y + h));

    gl_FragColor = vec4(color, 1.0);
  }
`

function compileShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function MountainBanner({ speed = 0.5, octaves = 5, scale = 2 }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const gl = canvas.getContext('webgl')
    if (!gl) {
      setError('WebGL nie jest wspierany w tej przeglądarce.')
      return
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource)
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource)
    if (!vs || !fs) {
      setError('Błąd kompilacji shadera.')
      return
    }

    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program))
      setError('Błąd łączenia programu shadera.')
      return
    }

    const posLoc = gl.getAttribLocation(program, 'a_position')
    const resLoc = gl.getUniformLocation(program, 'iResolution')
    const timeLoc = gl.getUniformLocation(program, 'iTime')
    const speedLoc = gl.getUniformLocation(program, 'u_speed')
    const octLoc = gl.getUniformLocation(program, 'u_octaves')
    const scaleLoc = gl.getUniformLocation(program, 'u_scale')

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW)

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    window.addEventListener('resize', resize)
    resize()

    const startTime = Date.now()
    const drawFrame = (time) => {
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)
      gl.enableVertexAttribArray(posLoc)
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)
      gl.uniform2f(resLoc, canvas.width, canvas.height)
      gl.uniform1f(timeLoc, time)
      gl.uniform1f(speedLoc, speed)
      gl.uniform1f(octLoc, octaves)
      gl.uniform1f(scaleLoc, scale)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let frameId = null
    const animate = () => {
      drawFrame((Date.now() - startTime) * 0.001)
      frameId = requestAnimationFrame(animate)
    }

    if (prefersReducedMotion) {
      drawFrame(0)
    } else {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && frameId === null) {
            animate()
          } else if (!entry.isIntersecting && frameId !== null) {
            cancelAnimationFrame(frameId)
            frameId = null
          }
        },
        { threshold: 0 },
      )
      observer.observe(container)

      return () => {
        if (frameId !== null) cancelAnimationFrame(frameId)
        observer.disconnect()
        window.removeEventListener('resize', resize)
      }
    }

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [speed, octaves, scale])

  return (
    <div ref={containerRef} className="mountain-banner" role="img" aria-label="Ilustracja gór">
      {error ? <div className="mountain-banner-fallback" /> : <canvas ref={canvasRef} />}
    </div>
  )
}

export default MountainBanner
