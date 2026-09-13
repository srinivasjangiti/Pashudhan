"use client"

import { useEffect, useRef, useCallback, memo } from "react"
import * as THREE from "three"

export const WebGLShader = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene | null
    camera: THREE.OrthographicCamera | null
    renderer: THREE.WebGLRenderer | null
    mesh: THREE.Mesh | null
    uniforms: any
    animationId: number | null
    isDestroyed: boolean
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
    isDestroyed: false,
  })

  // Optimized resize handler with debouncing
  const handleResize = useCallback(() => {
    if (!sceneRef.current.renderer || !sceneRef.current.uniforms || sceneRef.current.isDestroyed) return
    
    const width = window.innerWidth
    const height = window.innerHeight
    
    // Use lower resolution for better performance on mobile
    const pixelRatio = Math.min(window.devicePixelRatio, 2)
    sceneRef.current.renderer.setPixelRatio(pixelRatio)
    sceneRef.current.renderer.setSize(width, height, false)
    sceneRef.current.uniforms.resolution.value = [width, height]
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const { current: refs } = sceneRef

    // Optimized vertex shader
    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    // Optimized fragment shader with reduced complexity
    const fragmentShader = `
      #ifdef GL_ES
      precision highp float;
      #endif
      
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        
        float d = length(p) * distortion;
        float gx = p.x;

        // Simplified wave calculation for better performance
        float topWave = 0.015 / abs((p.y - 1.1) + sin((gx + time) * xScale) * yScale * 0.7);
        float bottomWave = 0.015 / abs((p.y + 1.1) + sin((gx + time * 0.8) * xScale) * yScale * 0.7);
        
        // Optimized fade calculation
        float fade = smoothstep(0.2, 1.0, abs(p.y));
        
        // Apply waves with fade
        float intensity = (topWave + bottomWave) * fade;
        
        // Simplified color calculation
        float white = min(intensity, 1.5) * 0.25;
        float green = intensity * 1.2;
        
        gl_FragColor = vec4(
          white + (intensity * 0.15) + (green * 0.25),
          white + green + (intensity * 0.7),
          white + (intensity * 0.15) + (green * 0.08),
          1.0
        );
      }
    `

    const initScene = () => {
      if (refs.isDestroyed) return
      
      refs.scene = new THREE.Scene()
      refs.renderer = new THREE.WebGLRenderer({ 
        canvas, 
        antialias: true, // Enable antialiasing for better quality
        alpha: false,
        stencil: false,
        depth: false,
        powerPreference: "high-performance"
      })
      
      const pixelRatio = Math.min(window.devicePixelRatio, 2)
      refs.renderer.setPixelRatio(pixelRatio)
      refs.renderer.setClearColor(new THREE.Color(0x000000))

      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1)

      refs.uniforms = {
        resolution: { value: [window.innerWidth, window.innerHeight] },
        time: { value: 0.0 },
        xScale: { value: 0.8 }, // Reduced for better performance
        yScale: { value: 0.4 }, // Reduced for better performance
        distortion: { value: 0.03 }, // Reduced for better performance
      }

      const position = [
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0,  1.0, 0.0,
      ]

      const positions = new THREE.BufferAttribute(new Float32Array(position), 3)
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", positions)

      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        side: THREE.DoubleSide,
      })

      refs.mesh = new THREE.Mesh(geometry, material)
      refs.scene.add(refs.mesh)

      handleResize()
    }

    // Optimized animation loop with frame rate limiting
    let lastTime = 0
    const targetFPS = 60
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime: number) => {
      if (refs.isDestroyed) return
      
      if (currentTime - lastTime >= frameInterval) {
        if (refs.uniforms && !refs.isDestroyed) {
          refs.uniforms.time.value += 0.008 // Reduced animation speed for smoother performance
        }
        
        if (refs.renderer && refs.scene && refs.camera && !refs.isDestroyed) {
          refs.renderer.render(refs.scene, refs.camera)
        }
        
        lastTime = currentTime
      }
      
      refs.animationId = requestAnimationFrame(animate)
    }

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout
    const debouncedHandleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(handleResize, 100)
    }

    initScene()
    animate(0)
    window.addEventListener("resize", debouncedHandleResize, { passive: true })

    return () => {
      refs.isDestroyed = true
      
      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId)
      }
      
      clearTimeout(resizeTimeout)
      window.removeEventListener("resize", debouncedHandleResize)
      
      // Cleanup Three.js resources
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh)
        refs.mesh.geometry.dispose()
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose()
        }
      }
      
      if (refs.renderer) {
        refs.renderer.dispose()
        refs.renderer.forceContextLoss()
      }
      
      // Clear references
      refs.scene = null
      refs.camera = null
      refs.renderer = null
      refs.mesh = null
      refs.uniforms = null
    }
  }, [handleResize])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full block"
      style={{ 
        willChange: 'auto', // Optimize for rendering
        pointerEvents: 'none' // Prevent interference with UI
      }}
    />
  )
})

WebGLShader.displayName = 'WebGLShader'
