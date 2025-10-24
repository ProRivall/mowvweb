import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { BloomEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect, SMAAPreset } from 'postprocessing'

import './Hyperspeed.css'

const BASE_OPTIONS = {
  onSpeedUp: () => {},
  onSlowDown: () => {},
  distortion: 'mountainDistortion',
  length: 400,
  roadWidth: 9,
  islandWidth: 2,
  lanesPerRoad: 3,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 50,
  lightPairsPerRoadWay: 50,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [60, 80],
  movingCloserSpeed: [-120, -160],
  carLightsLength: [20, 60],
  carLightsRadius: [0.05, 0.14],
  carWidthPercentage: [0.3, 0.5],
  carShiftX: [-0.2, 0.2],
  carFloorSeparation: [0.05, 1],
  maxPixelRatio: 1.5,
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0x131318,
    brokenLines: 0x131318,
    leftCars: [0xff102a, 0xeb383e, 0xff102a],
    rightCars: [0xf5f5f5, 0xd9d9db, 0xa7a7aa],
    sticks: 0xd9d9db,
  },
  isHyper: false,
}

const deepMergeOptions = (base, overrides) => {
  const result = Array.isArray(base) ? [...base] : { ...base }
  if (!overrides) {
    return result
  }

  Object.entries(overrides).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      result[key] = value.slice()
    } else if (value && typeof value === 'object') {
      result[key] = deepMergeOptions(base[key] || {}, value)
    } else {
      result[key] = value
    }
  })

  return result
}

const createDistortions = () => {
  const mountainUniforms = {
    uFreq: { value: new THREE.Vector3(3, 6, 10) },
    uAmp: { value: new THREE.Vector3(30, 30, 20) },
  }

  const xyUniforms = {
    uFreq: { value: new THREE.Vector2(5, 2) },
    uAmp: { value: new THREE.Vector2(25, 15) },
  }

  const longRaceUniforms = {
    uFreq: { value: new THREE.Vector2(2, 3) },
    uAmp: { value: new THREE.Vector2(35, 10) },
  }

  const turbulentUniforms = {
    uFreq: { value: new THREE.Vector4(4, 8, 8, 1) },
    uAmp: { value: new THREE.Vector4(25, 5, 10, 10) },
  }

  const deepUniforms = {
    uFreq: { value: new THREE.Vector2(4, 8) },
    uAmp: { value: new THREE.Vector2(10, 20) },
    uPowY: { value: new THREE.Vector2(20, 2) },
  }

  const nsin = (val) => Math.sin(val) * 0.5 + 0.5

  const distortions = {
    mountainDistortion: {
      uniforms: mountainUniforms,
      getDistortion: `
        uniform vec3 uAmp;
        uniform vec3 uFreq;
        #define PI 3.14159265358979
        float nsin(float val){
          return sin(val) * 0.5 + 0.5;
        }
        vec3 getDistortion(float progress){
          float movementProgressFix = 0.02;
          return vec3(
            cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(movementProgressFix * PI * uFreq.x + uTime) * uAmp.x,
            nsin(progress * PI * uFreq.y + uTime) * uAmp.y - nsin(movementProgressFix * PI * uFreq.y + uTime) * uAmp.y,
            nsin(progress * PI * uFreq.z + uTime) * uAmp.z - nsin(movementProgressFix * PI * uFreq.z + uTime) * uAmp.z
          );
        }
      `,
      getJS: (progress, time) => {
        const movementProgressFix = 0.02
        const uFreq = mountainUniforms.uFreq.value
        const uAmp = mountainUniforms.uAmp.value
        const distortion = new THREE.Vector3(
          Math.cos(progress * Math.PI * uFreq.x + time) * uAmp.x -
            Math.cos(movementProgressFix * Math.PI * uFreq.x + time) * uAmp.x,
          nsin(progress * Math.PI * uFreq.y + time) * uAmp.y -
            nsin(movementProgressFix * Math.PI * uFreq.y + time) * uAmp.y,
          nsin(progress * Math.PI * uFreq.z + time) * uAmp.z -
            nsin(movementProgressFix * Math.PI * uFreq.z + time) * uAmp.z,
        )
        const lookAtAmp = new THREE.Vector3(2, 2, 2)
        const lookAtOffset = new THREE.Vector3(0, 0, -5)
        return distortion.multiply(lookAtAmp).add(lookAtOffset)
      },
    },
    xyDistortion: {
      uniforms: xyUniforms,
      getDistortion: `
        uniform vec2 uFreq;
        uniform vec2 uAmp;
        #define PI 3.14159265358979
        vec3 getDistortion(float progress){
          float movementProgressFix = 0.02;
          return vec3(
            cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(movementProgressFix * PI * uFreq.x + uTime) * uAmp.x,
            sin(progress * PI * uFreq.y + PI/2. + uTime) * uAmp.y - sin(movementProgressFix * PI * uFreq.y + PI/2. + uTime) * uAmp.y,
            0.
          );
        }
      `,
      getJS: (progress, time) => {
        const movementProgressFix = 0.02
        const uFreq = xyUniforms.uFreq.value
        const uAmp = xyUniforms.uAmp.value
        const distortion = new THREE.Vector3(
          Math.cos(progress * Math.PI * uFreq.x + time) * uAmp.x -
            Math.cos(movementProgressFix * Math.PI * uFreq.x + time) * uAmp.x,
          Math.sin(progress * Math.PI * uFreq.y + time + Math.PI / 2) * uAmp.y -
            Math.sin(movementProgressFix * Math.PI * uFreq.y + time + Math.PI / 2) * uAmp.y,
          0,
        )
        const lookAtAmp = new THREE.Vector3(2, 0.4, 1)
        const lookAtOffset = new THREE.Vector3(0, 0, -3)
        return distortion.multiply(lookAtAmp).add(lookAtOffset)
      },
    },
    LongRaceDistortion: {
      uniforms: longRaceUniforms,
      getDistortion: `
        uniform vec2 uFreq;
        uniform vec2 uAmp;
        #define PI 3.14159265358979
        vec3 getDistortion(float progress){
          float camProgress = 0.0125;
          return vec3(
            sin(progress * PI * uFreq.x + uTime) * uAmp.x - sin(camProgress * PI * uFreq.x + uTime) * uAmp.x,
            sin(progress * PI * uFreq.y + uTime) * uAmp.y - sin(camProgress * PI * uFreq.y + uTime) * uAmp.y,
            0.
          );
        }
      `,
      getJS: (progress, time) => {
        const camProgress = 0.0125
        const uFreq = longRaceUniforms.uFreq.value
        const uAmp = longRaceUniforms.uAmp.value
        const distortion = new THREE.Vector3(
          Math.sin(progress * Math.PI * uFreq.x + time) * uAmp.x -
            Math.sin(camProgress * Math.PI * uFreq.x + time) * uAmp.x,
          Math.sin(progress * Math.PI * uFreq.y + time) * uAmp.y -
            Math.sin(camProgress * Math.PI * uFreq.y + time) * uAmp.y,
          0,
        )
        const lookAtAmp = new THREE.Vector3(1, 1, 0)
        const lookAtOffset = new THREE.Vector3(0, 0, -5)
        return distortion.multiply(lookAtAmp).add(lookAtOffset)
      },
    },
    turbulentDistortion: {
      uniforms: turbulentUniforms,
      getDistortion: `
        uniform vec4 uFreq;
        uniform vec4 uAmp;
        float nsin(float val){
          return sin(val) * 0.5 + 0.5;
        }
        #define PI 3.14159265358979
        float getDistortionX(float progress){
          return (
            cos(PI * progress * uFreq.r + uTime) * uAmp.r +
            pow(cos(PI * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2. ) * uAmp.g
          );
        }
        float getDistortionY(float progress){
          return (
            -nsin(PI * progress * uFreq.b + uTime) * uAmp.b +
            -pow(nsin(PI * progress * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.) * uAmp.a
          );
        }
        vec3 getDistortion(float progress){
          return vec3(
            getDistortionX(progress) - getDistortionX(0.0125),
            getDistortionY(progress) - getDistortionY(0.0125),
            0.
          );
        }
      `,
      getJS: (progress, time) => {
        const uFreq = turbulentUniforms.uFreq.value
        const uAmp = turbulentUniforms.uAmp.value

        const getX = (p) =>
          Math.cos(Math.PI * p * uFreq.x + time) * uAmp.x +
          Math.pow(Math.cos(Math.PI * p * uFreq.y + time * (uFreq.y / uFreq.x)), 2) * uAmp.y

        const getY = (p) =>
          -nsin(Math.PI * p * uFreq.z + time) * uAmp.z -
          Math.pow(nsin(Math.PI * p * uFreq.w + time / (uFreq.z / uFreq.w)), 5) * uAmp.w

        const distortion = new THREE.Vector3(
          getX(progress) - getX(progress + 0.007),
          getY(progress) - getY(progress + 0.007),
          0,
        )
        const lookAtAmp = new THREE.Vector3(2, 1.4, 2)
        const lookAtOffset = new THREE.Vector3(0, 0, -6)
        return distortion.multiply(lookAtAmp).add(lookAtOffset)
      },
    },
    deepDistortion: {
      uniforms: deepUniforms,
      getDistortion: `
        uniform vec2 uFreq;
        uniform vec2 uAmp;
        uniform vec2 uPowY;
        #define PI 3.14159265358979
        vec3 getDistortion(float progress){
          return vec3(
            sin(progress * PI * uFreq.x + uTime) * uAmp.x,
            pow(sin(progress * PI * uFreq.y + uTime * PI), uPowY.y) * uAmp.y,
            0.
          );
        }
      `,
      getJS: (progress, time) => {
        const uFreq = deepUniforms.uFreq.value
        const uAmp = deepUniforms.uAmp.value
        const uPowY = deepUniforms.uPowY.value
        const distortion = new THREE.Vector3(
          Math.sin(progress * Math.PI * uFreq.x + time) * uAmp.x,
          Math.pow(Math.sin(progress * Math.PI * uFreq.y + time * Math.PI), uPowY.y) * uAmp.y,
          0,
        )
        const lookAtAmp = new THREE.Vector3(1.5, 1.2, 1.5)
        const lookAtOffset = new THREE.Vector3(0, 0, -4)
        return distortion.multiply(lookAtAmp).add(lookAtOffset)
      },
    },
  }

  const distortionUniforms = {
    uDistortionX: { value: new THREE.Vector2(80, 3) },
    uDistortionY: { value: new THREE.Vector2(-40, 2.5) },
  }

  const distortionVertex = `
    #define PI 3.14159265358979
    uniform vec2 uDistortionX;
    uniform vec2 uDistortionY;
    float nsin(float val){
      return sin(val) * 0.5 + 0.5;
    }
    vec3 getDistortion(float progress){
      progress = clamp(progress, 0., 1.);
      float xAmp = uDistortionX.r;
      float xFreq = uDistortionX.g;
      float yAmp = uDistortionY.r;
      float yFreq = uDistortionY.g;
      return vec3(
        xAmp * nsin(progress * PI * xFreq - PI / 2.),
        yAmp * nsin(progress * PI * yFreq - PI / 2.),
        0.
      );
    }
  `

  distortions.distortionFallback = {
    uniforms: distortionUniforms,
    getDistortion: distortionVertex,
  }

  return distortions
}

const randomBetween = (base) => {
  if (Array.isArray(base)) {
    return Math.random() * (base[1] - base[0]) + base[0]
  }
  return Math.random() * base
}

const pickRandom = (source) => {
  if (Array.isArray(source)) {
    return source[Math.floor(Math.random() * source.length)]
  }
  return source
}

const lerp = (current, target, speed = 0.1, limit = 0.001) => {
  let change = (target - current) * speed
  if (Math.abs(change) < limit) {
    change = target - current
  }
  return change
}
function Hyperspeed({ effectOptions }) {
  const containerRef = useRef(null)
  const appRef = useRef(null)

  const mergedOptions = useMemo(() => deepMergeOptions(BASE_OPTIONS, effectOptions), [effectOptions])
  const optionsSignature = useMemo(() => JSON.stringify(mergedOptions), [mergedOptions])

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return () => {}
    }

    if (appRef.current) {
      appRef.current.dispose()
      appRef.current = null
    }

    const overrides = JSON.parse(optionsSignature)
    const options = deepMergeOptions(BASE_OPTIONS, overrides)
    const distortions = createDistortions()

    if (typeof options.distortion === 'string') {
      options.distortion = distortions[options.distortion] || distortions.distortionFallback
    }

    if (!options.distortion) {
      options.distortion = distortions.distortionFallback
    }

    const resizeRendererToDisplaySize = (renderer, setSize) => {
      const canvas = renderer.domElement
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const needResize = canvas.width !== width || canvas.height !== height
      if (needResize) {
        setSize(width, height, false)
      }
      return needResize
    }

    class CarLights {
      constructor(webgl, carOptions, colors, speed, fade) {
        this.webgl = webgl
        this.options = carOptions
        this.colors = colors
        this.speed = speed
        this.fade = fade
        this.mesh = null
      }

      init() {
        const options = this.options
        const curve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1))
        const geometry = new THREE.TubeGeometry(curve, 40, 1, 8, false)
        const instanced = new THREE.InstancedBufferGeometry().copy(geometry)
        instanced.instanceCount = options.lightPairsPerRoadWay * 2

        const laneWidth = options.roadWidth / options.lanesPerRoad

        const aOffset = []
        const aMetrics = []
        const aColor = []

        let colorArray
        if (Array.isArray(this.colors)) {
          colorArray = this.colors.map((c) => new THREE.Color(c))
        } else {
          colorArray = [new THREE.Color(this.colors)]
        }

        for (let i = 0; i < options.lightPairsPerRoadWay; i += 1) {
          const radius = randomBetween(options.carLightsRadius)
          const length = randomBetween(options.carLightsLength)
          const spd = randomBetween(this.speed)
          const carLane = i % options.lanesPerRoad
          let laneX = carLane * laneWidth - options.roadWidth / 2 + laneWidth / 2
          const carWidth = randomBetween(options.carWidthPercentage) * laneWidth
          const carShiftX = randomBetween(options.carShiftX) * laneWidth
          laneX += carShiftX

          const offsetY = randomBetween(options.carFloorSeparation) + radius * 1.3
          const offsetZ = -randomBetween(options.length)

          aOffset.push(laneX - carWidth / 2, offsetY, offsetZ)
          aOffset.push(laneX + carWidth / 2, offsetY, offsetZ)

          aMetrics.push(radius, length, spd)
          aMetrics.push(radius, length, spd)

          const color = pickRandom(colorArray)
          aColor.push(color.r, color.g, color.b, color.r, color.g, color.b)
        }

        instanced.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3))
        instanced.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3))
        instanced.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3))

        const material = new THREE.ShaderMaterial({
          fragmentShader: carLightsFragment,
          vertexShader: carLightsVertex,
          transparent: true,
          uniforms: Object.assign(
            {
              uTime: { value: 0 },
              uTravelLength: { value: options.length },
              uFade: { value: this.fade },
            },
            this.webgl.fogUniforms,
            typeof this.options.distortion === 'object' ? this.options.distortion.uniforms : {},
          ),
        })

        material.onBeforeCompile = (shader) => {
          shader.vertexShader = shader.vertexShader.replace(
            '#include <getDistortion_vertex>',
            typeof this.options.distortion === 'object' ? this.options.distortion.getDistortion : '',
          )
        }

        const mesh = new THREE.Mesh(instanced, material)
        mesh.frustumCulled = false
        this.webgl.scene.add(mesh)
        this.mesh = mesh
      }

      update(time) {
        if (this.mesh && this.mesh.material.uniforms.uTime) {
          this.mesh.material.uniforms.uTime.value = time
        }
      }
    }
    const carLightsFragment = `
      #define USE_FOG;
      ${THREE.ShaderChunk['fog_pars_fragment']}
      varying vec3 vColor;
      varying vec2 vUv;
      uniform vec2 uFade;
      void main() {
        vec3 color = vec3(vColor);
        float alpha = smoothstep(uFade.x, uFade.y, vUv.x);
        gl_FragColor = vec4(color, alpha);
        if (gl_FragColor.a < 0.0001) discard;
        ${THREE.ShaderChunk['fog_fragment']}
      }
    `

    const carLightsVertex = `
      #define USE_FOG;
      ${THREE.ShaderChunk['fog_pars_vertex']}
      attribute vec3 aOffset;
      attribute vec3 aMetrics;
      attribute vec3 aColor;
      uniform float uTravelLength;
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vColor;
      #include <getDistortion_vertex>
      void main() {
        vec3 transformed = position.xyz;
        float radius = aMetrics.r;
        float myLength = aMetrics.g;
        float speed = aMetrics.b;
        transformed.xy *= radius;
        transformed.z *= myLength;
        transformed.z += myLength - mod(uTime * speed + aOffset.z, uTravelLength);
        transformed.xy += aOffset.xy;
        float progress = abs(transformed.z / uTravelLength);
        transformed.xyz += getDistortion(progress);
        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
        gl_Position = projectionMatrix * mvPosition;
        vUv = uv;
        vColor = aColor;
        ${THREE.ShaderChunk['fog_vertex']}
      }
    `

    class LightsSticks {
      constructor(webgl, stickOptions) {
        this.webgl = webgl
        this.options = stickOptions
        this.mesh = null
      }

      init() {
        const options = this.options
        const geometry = new THREE.PlaneGeometry(1, 1)
        const instanced = new THREE.InstancedBufferGeometry().copy(geometry)
        const totalSticks = options.totalSideLightSticks
        instanced.instanceCount = totalSticks

        const stickoffset = options.length / (totalSticks - 1)
        const aOffset = []
        const aColor = []
        const aMetrics = []

        let colors = options.colors.sticks
        if (Array.isArray(colors)) {
          colors = colors.map((c) => new THREE.Color(c))
        } else {
          colors = [new THREE.Color(colors)]
        }

        for (let i = 0; i < totalSticks; i += 1) {
          const width = randomBetween(options.lightStickWidth)
          const height = randomBetween(options.lightStickHeight)
          aOffset.push((i - 1) * stickoffset * 2 + stickoffset * Math.random())
          const color = pickRandom(colors)
          aColor.push(color.r, color.g, color.b)
          aMetrics.push(width, height)
        }

        instanced.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 1))
        instanced.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3))
        instanced.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 2))

        const material = new THREE.ShaderMaterial({
          fragmentShader: sideSticksFragment,
          vertexShader: sideSticksVertex,
          side: THREE.DoubleSide,
          uniforms: Object.assign(
            {
              uTravelLength: { value: options.length },
              uTime: { value: 0 },
            },
            this.webgl.fogUniforms,
            options.distortion.uniforms,
          ),
        })

        material.onBeforeCompile = (shader) => {
          shader.vertexShader = shader.vertexShader.replace(
            '#include <getDistortion_vertex>',
            options.distortion.getDistortion,
          )
        }

        const mesh = new THREE.Mesh(instanced, material)
        mesh.frustumCulled = false
        this.webgl.scene.add(mesh)
        this.mesh = mesh
      }

      update(time) {
        if (this.mesh) {
          this.mesh.material.uniforms.uTime.value = time
        }
      }
    }

    const sideSticksVertex = `
      #define USE_FOG;
      ${THREE.ShaderChunk['fog_pars_vertex']}
      attribute float aOffset;
      attribute vec3 aColor;
      attribute vec2 aMetrics;
      uniform float uTravelLength;
      uniform float uTime;
      varying vec3 vColor;
      mat4 rotationY( in float angle ) {
        return mat4(
          cos(angle), 0.0, sin(angle), 0.0,
          0.0, 1.0, 0.0, 0.0,
          -sin(angle), 0.0, cos(angle), 0.0,
          0.0, 0.0, 0.0, 1.0
        );
      }
      #include <getDistortion_vertex>
      void main(){
        vec3 transformed = position.xyz;
        float width = aMetrics.x;
        float height = aMetrics.y;
        transformed.xy *= vec2(width, height);
        float time = mod(uTime * 120. + aOffset, uTravelLength);
        transformed = (rotationY(PI / 2.) * vec4(transformed,1.)).xyz;
        transformed.z += -uTravelLength + time;
        float progress = abs(transformed.z / uTravelLength);
        transformed.xyz += getDistortion(progress);
        transformed.y += height / 2.;
        transformed.x += -width / 2.;
        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
        gl_Position = projectionMatrix * mvPosition;
        vColor = aColor;
        ${THREE.ShaderChunk['fog_vertex']}
      }
    `

    const sideSticksFragment = `
      #define USE_FOG;
      ${THREE.ShaderChunk['fog_pars_fragment']}
      varying vec3 vColor;
      void main(){
        vec3 color = vec3(vColor);
        gl_FragColor = vec4(color,1.);
        ${THREE.ShaderChunk['fog_fragment']}
      }
    `
    class Road {
      constructor(webgl, roadOptions) {
        this.webgl = webgl
        this.options = roadOptions
        this.uTime = { value: 0 }
        this.leftRoadWay = null
        this.rightRoadWay = null
        this.island = null
      }

      createPlane(side, width, isRoad) {
        const options = this.options
        const geometry = new THREE.PlaneGeometry(
          isRoad ? options.roadWidth : options.islandWidth,
          options.length,
          20,
          100,
        )

        let uniforms = {
          uTravelLength: { value: options.length },
          uColor: { value: new THREE.Color(isRoad ? options.colors.roadColor : options.colors.islandColor) },
          uTime: this.uTime,
        }

        if (isRoad) {
          uniforms = Object.assign(uniforms, {
            uLanes: { value: options.lanesPerRoad },
            uBrokenLinesColor: { value: new THREE.Color(options.colors.brokenLines) },
            uShoulderLinesColor: { value: new THREE.Color(options.colors.shoulderLines) },
            uShoulderLinesWidthPercentage: { value: options.shoulderLinesWidthPercentage },
            uBrokenLinesLengthPercentage: { value: options.brokenLinesLengthPercentage },
            uBrokenLinesWidthPercentage: { value: options.brokenLinesWidthPercentage },
          })
        }

        const material = new THREE.ShaderMaterial({
          fragmentShader: isRoad ? roadFragment : islandFragment,
          vertexShader: roadVertex,
          side: THREE.DoubleSide,
          uniforms: Object.assign(
            uniforms,
            this.webgl.fogUniforms,
            typeof options.distortion === 'object' ? options.distortion.uniforms : {},
          ),
        })

        material.onBeforeCompile = (shader) => {
          shader.vertexShader = shader.vertexShader.replace(
            '#include <getDistortion_vertex>',
            typeof this.options.distortion === 'object' ? this.options.distortion.getDistortion : '',
          )
        }

        const mesh = new THREE.Mesh(geometry, material)
        mesh.rotation.x = -Math.PI / 2
        mesh.position.z = -options.length / 2
        mesh.position.x += (this.options.islandWidth / 2 + options.roadWidth / 2) * side
        this.webgl.scene.add(mesh)
        return mesh
      }

      init() {
        this.leftRoadWay = this.createPlane(-1, this.options.roadWidth, true)
        this.rightRoadWay = this.createPlane(1, this.options.roadWidth, true)
        this.island = this.createPlane(0, this.options.islandWidth, false)
      }

      update(time) {
        this.uTime.value = time
      }
    }

    const roadBaseFragment = `
      #define USE_FOG;
      varying vec2 vUv;
      uniform vec3 uColor;
      uniform float uTime;
      #include <roadMarkings_vars>
      ${THREE.ShaderChunk['fog_pars_fragment']}
      void main() {
        vec2 uv = vUv;
        vec3 color = vec3(uColor);
        #include <roadMarkings_fragment>
        gl_FragColor = vec4(color, 1.);
        ${THREE.ShaderChunk['fog_fragment']}
      }
    `

    const islandFragment = roadBaseFragment
      .replace('#include <roadMarkings_fragment>', '')
      .replace('#include <roadMarkings_vars>', '')

    const roadMarkingsVars = `
      uniform float uLanes;
      uniform vec3 uBrokenLinesColor;
      uniform vec3 uShoulderLinesColor;
      uniform float uShoulderLinesWidthPercentage;
      uniform float uBrokenLinesWidthPercentage;
      uniform float uBrokenLinesLengthPercentage;
      highp float random(vec2 co) {
        highp float a = 12.9898;
        highp float b = 78.233;
        highp float c = 43758.5453;
        highp float dt = dot(co.xy, vec2(a, b));
        highp float sn = mod(dt, 3.14);
        return fract(sin(sn) * c);
      }
    `

    const roadMarkingsFragment = `
      uv.y = mod(uv.y + uTime * 0.05, 1.);
      float laneWidth = 1.0 / uLanes;
      float brokenLineWidth = laneWidth * uBrokenLinesWidthPercentage;
      float laneEmptySpace = 1.0 - uBrokenLinesLengthPercentage;
      float brokenLines = step(1.0 - brokenLineWidth, fract(uv.x * 2.0)) * step(laneEmptySpace, fract(uv.y * 10.0));
      float sideLines = step(1.0 - brokenLineWidth, fract((uv.x - laneWidth * (uLanes - 1.0)) * 2.0)) + step(brokenLineWidth, uv.x);
      brokenLines = mix(brokenLines, sideLines, uv.x);
      color = mix(color, uBrokenLinesColor, brokenLines);
    `

    const roadFragment = roadBaseFragment
      .replace('#include <roadMarkings_fragment>', roadMarkingsFragment)
      .replace('#include <roadMarkings_vars>', roadMarkingsVars)

    const roadVertex = `
      #define USE_FOG;
      uniform float uTime;
      ${THREE.ShaderChunk['fog_pars_vertex']}
      uniform float uTravelLength;
      varying vec2 vUv;
      #include <getDistortion_vertex>
      void main() {
        vec3 transformed = position.xyz;
        vec3 distortion = getDistortion((transformed.y + uTravelLength / 2.) / uTravelLength);
        transformed.x += distortion.x;
        transformed.z += distortion.y;
        transformed.y += -1. * distortion.z;
        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
        gl_Position = projectionMatrix * mvPosition;
        vUv = uv;
        ${THREE.ShaderChunk['fog_vertex']}
      }
    `
    class App {
      constructor(containerEl, appOptions) {
        this.container = containerEl
        this.options = appOptions
        if (!this.options.distortion) {
          this.options.distortion = distortions.distortionFallback
        }

        this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
        this.updatePixelRatio()
        this.renderer.setSize(containerEl.offsetWidth, containerEl.offsetHeight, false)
        this.composer = new EffectComposer(this.renderer)
        containerEl.appendChild(this.renderer.domElement)

        this.camera = new THREE.PerspectiveCamera(
          appOptions.fov,
          containerEl.offsetWidth / containerEl.offsetHeight,
          0.1,
          10000,
        )
        this.camera.position.set(0, 8, -5)

        this.scene = new THREE.Scene()
        this.scene.background = null

        const fog = new THREE.Fog(appOptions.colors.background, appOptions.length * 0.2, appOptions.length * 500)
        this.scene.fog = fog

        this.fogUniforms = {
          fogColor: { value: fog.color },
          fogNear: { value: fog.near },
          fogFar: { value: fog.far },
        }

        this.clock = new THREE.Clock()
        this.assets = {}
        this.disposed = false

        this.road = new Road(this, appOptions)
        this.leftCarLights = new CarLights(
          this,
          appOptions,
          appOptions.colors.leftCars,
          appOptions.movingAwaySpeed,
          new THREE.Vector2(0, 1 - appOptions.carLightsFade),
        )
        this.rightCarLights = new CarLights(
          this,
          appOptions,
          appOptions.colors.rightCars,
          appOptions.movingCloserSpeed,
          new THREE.Vector2(1, 0 + appOptions.carLightsFade),
        )
        this.leftSticks = new LightsSticks(this, appOptions)

        this.fovTarget = appOptions.fov
        this.speedUpTarget = 0
        this.speedUp = 0
        this.timeOffset = 0

        this.tick = this.tick.bind(this)
        this.init = this.init.bind(this)
        this.setSize = this.setSize.bind(this)
        this.updatePixelRatio = this.updatePixelRatio.bind(this)
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMouseUp = this.onMouseUp.bind(this)
        this.onTouchStart = this.onTouchStart.bind(this)
        this.onTouchEnd = this.onTouchEnd.bind(this)
        this.onContextMenu = this.onContextMenu.bind(this)
        this.onWindowResize = this.onWindowResize.bind(this)

        window.addEventListener('resize', this.onWindowResize)
      }

      onWindowResize() {
        const width = this.container.offsetWidth
        const height = this.container.offsetHeight
        this.updatePixelRatio()
        this.renderer.setSize(width, height)
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.composer.setSize(width, height)
      }

      initPasses() {
        this.renderPass = new RenderPass(this.scene, this.camera)
        this.bloomPass = new EffectPass(
          this.camera,
          new BloomEffect({
            luminanceThreshold: 0.2,
            luminanceSmoothing: 0,
            resolutionScale: 1,
          }),
        )

        const smaaPass = new EffectPass(
          this.camera,
          new SMAAEffect({
            preset: SMAAPreset.MEDIUM,
            searchImage: SMAAEffect.searchImageDataURL,
            areaImage: SMAAEffect.areaImageDataURL,
          }),
        )

        this.renderPass.renderToScreen = false
        this.bloomPass.renderToScreen = false
        smaaPass.renderToScreen = true

        this.composer.addPass(this.renderPass)
        this.composer.addPass(this.bloomPass)
        this.composer.addPass(smaaPass)
      }

      loadAssets() {
        this.assets = {}
        return new Promise((resolve) => {
          const manager = new THREE.LoadingManager(resolve)

          const searchImage = new Image()
          const areaImage = new Image()
          this.assets.smaa = {}

          searchImage.addEventListener('load', function () {
            this.assets.smaa.search = this
            manager.itemEnd('smaa-search')
          }.bind(this))

          areaImage.addEventListener('load', function () {
            this.assets.smaa.area = this
            manager.itemEnd('smaa-area')
          }.bind(this))

          manager.itemStart('smaa-search')
          manager.itemStart('smaa-area')

          searchImage.src = SMAAEffect.searchImageDataURL
          areaImage.src = SMAAEffect.areaImageDataURL
        })
      }

      init() {
        this.initPasses()
        const options = this.options
        this.road.init()
        this.leftCarLights.init()
        this.leftCarLights.mesh.position.setX(-options.roadWidth / 2 - options.islandWidth / 2)
        this.rightCarLights.init()
        this.rightCarLights.mesh.position.setX(options.roadWidth / 2 + options.islandWidth / 2)
        this.leftSticks.init()
        this.leftSticks.mesh.position.setX(-(options.roadWidth + options.islandWidth / 2))

        this.container.addEventListener('mousedown', this.onMouseDown)
        this.container.addEventListener('mouseup', this.onMouseUp)
        this.container.addEventListener('mouseout', this.onMouseUp)
        this.container.addEventListener('touchstart', this.onTouchStart, { passive: true })
        this.container.addEventListener('touchend', this.onTouchEnd, { passive: true })
        this.container.addEventListener('touchcancel', this.onTouchEnd, { passive: true })
        this.container.addEventListener('contextmenu', this.onContextMenu)

        this.tick()
      }

      onMouseDown(ev) {
        if (this.options.onSpeedUp) {
          this.options.onSpeedUp(ev)
        }
        this.fovTarget = this.options.fovSpeedUp
        this.speedUpTarget = this.options.speedUp
      }

      onMouseUp(ev) {
        if (this.options.onSlowDown) {
          this.options.onSlowDown(ev)
        }
        this.fovTarget = this.options.fov
        this.speedUpTarget = 0
      }

      onTouchStart(ev) {
        if (this.options.onSpeedUp) {
          this.options.onSpeedUp(ev)
        }
        this.fovTarget = this.options.fovSpeedUp
        this.speedUpTarget = this.options.speedUp
      }

      onTouchEnd(ev) {
        if (this.options.onSlowDown) {
          this.options.onSlowDown(ev)
        }
        this.fovTarget = this.options.fov
        this.speedUpTarget = 0
      }

      onContextMenu(ev) {
        ev.preventDefault()
      }

      update(delta) {
        const lerpPercentage = Math.exp(-(-60 * Math.log2(1 - 0.1)) * delta)
        this.speedUp += lerp(this.speedUp, this.speedUpTarget, lerpPercentage, 0.00001)
        this.timeOffset += this.speedUp * delta
        const time = this.clock.elapsedTime + this.timeOffset
        this.rightCarLights.update(time)
        this.leftCarLights.update(time)
        this.leftSticks.update(time)
        this.road.update(time)

        let updateCamera = false
        const fovChange = lerp(this.camera.fov, this.fovTarget, lerpPercentage)
        if (fovChange !== 0) {
          this.camera.fov += fovChange * delta * 6
          updateCamera = true
        }

        if (this.options.distortion && this.options.distortion.getJS) {
          const distortion = this.options.distortion.getJS(0.025, time)
          this.camera.lookAt(
            new THREE.Vector3(
              this.camera.position.x + distortion.x,
              this.camera.position.y + distortion.y,
              this.camera.position.z + distortion.z,
            ),
          )
          updateCamera = true
        }

        if (updateCamera) {
          this.camera.updateProjectionMatrix()
        }
      }

      render(delta) {
        this.composer.render(delta)
      }

      dispose() {
        this.disposed = true
        if (this.renderer) {
          this.renderer.dispose()
        }
        if (this.composer) {
          this.composer.dispose()
        }
        if (this.scene) {
          this.scene.clear()
        }

        window.removeEventListener('resize', this.onWindowResize)

        if (this.container) {
          this.container.removeEventListener('mousedown', this.onMouseDown)
          this.container.removeEventListener('mouseup', this.onMouseUp)
          this.container.removeEventListener('mouseout', this.onMouseUp)
          this.container.removeEventListener('touchstart', this.onTouchStart)
          this.container.removeEventListener('touchend', this.onTouchEnd)
          this.container.removeEventListener('touchcancel', this.onTouchEnd)
          this.container.removeEventListener('contextmenu', this.onContextMenu)
        }

        const canvas = this.renderer ? this.renderer.domElement : null
        if (canvas && canvas.parentNode === this.container) {
          this.container.removeChild(canvas)
        }
      }

      setSize(width, height, updateStyles) {
        this.composer.setSize(width, height, updateStyles)
      }

      updatePixelRatio() {
        const deviceRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
        const maxRatio = this.options.maxPixelRatio ?? 1.5
        const clampedRatio = Math.min(deviceRatio, maxRatio)
        this.renderer.setPixelRatio(clampedRatio)
        return clampedRatio
      }

      tick() {
        if (this.disposed) {
          return
        }
        if (resizeRendererToDisplaySize(this.renderer, this.setSize)) {
          this.updatePixelRatio()
          const canvas = this.renderer.domElement
          this.camera.aspect = canvas.clientWidth / canvas.clientHeight
          this.camera.updateProjectionMatrix()
        }
        const delta = this.clock.getDelta()
        this.render(delta)
        this.update(delta)
        requestAnimationFrame(this.tick)
      }
    }

    const app = new App(container, options)
    appRef.current = app
    app.loadAssets().then(app.init)

    return () => {
      if (appRef.current) {
        appRef.current.dispose()
        appRef.current = null
      }
    }
  }, [optionsSignature])

  return <div className="hyperspeed-wrapper" ref={containerRef} />
}

export default Hyperspeed
