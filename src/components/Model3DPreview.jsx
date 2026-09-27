import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { create3DModelGroup } from './arModels'

export default function Model3DPreview({ modelId = 'butterfly', moodColor = '#00f0ff', height = 200 }) {
  const containerRef = useRef(null)
  const animFrameRef = useRef(null)
  const modelInstanceRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 320
    const currentHeight = height

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / currentHeight, 0.1, 50)
    camera.position.set(0, 0, 1.4)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(width, currentHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // 2. Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambientLight)

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4)
    dirLight1.position.set(2, 3, 4)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(new THREE.Color(moodColor), 1.0)
    dirLight2.position.set(-2, -2, 2)
    scene.add(dirLight2)

    // 3. Instantiate 3D Model
    const modelInstance = create3DModelGroup(modelId, moodColor, THREE)
    modelInstanceRef.current = modelInstance
    scene.add(modelInstance.group)

    // Center pivot rotation container
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0
    let targetRotY = 0
    let targetRotX = 0

    const onPointerDown = (e) => {
      isDragging = true
      prevMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0
      prevMouseY = e.clientY || (e.touches && e.touches[0].clientY) || 0
    }

    const onPointerMove = (e) => {
      if (!isDragging) return
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0
      const deltaX = clientX - prevMouseX
      const deltaY = clientY - prevMouseY
      targetRotY += deltaX * 0.015
      targetRotX += deltaY * 0.015
      prevMouseX = clientX
      prevMouseY = clientY
    }

    const onPointerUp = () => {
      isDragging = false
    }

    container.addEventListener('mousedown', onPointerDown)
    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('mouseup', onPointerUp)

    container.addEventListener('touchstart', onPointerDown, { passive: true })
    window.addEventListener('touchmove', onPointerMove, { passive: true })
    window.addEventListener('touchend', onPointerUp)

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const w = entry.contentRect.width
        if (w > 0) {
          camera.aspect = w / currentHeight
          camera.updateProjectionMatrix()
          renderer.setSize(w, currentHeight)
        }
      }
    })
    resizeObserver.observe(container)

    // Animation Loop
    const startTime = performance.now()
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate)
      const elapsed = (performance.now() - startTime) / 1000

      // Smooth inertia rotation
      modelInstance.group.rotation.y += (targetRotY - modelInstance.group.rotation.y) * 0.1
      modelInstance.group.rotation.x += (targetRotX - modelInstance.group.rotation.x) * 0.1

      // Auto gentle turntable rotation when not dragging
      if (!isDragging) {
        targetRotY += 0.005
      }

      // Model internal animations (wings flapping, boat rocking, etc.)
      modelInstance.update(elapsed)

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      container.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('mouseup', onPointerUp)
      container.removeEventListener('touchstart', onPointerDown)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('touchend', onPointerUp)
      resizeObserver.disconnect()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [modelId])

  // Update mood color in real-time
  useEffect(() => {
    if (modelInstanceRef.current && modelInstanceRef.current.setMoodColor) {
      modelInstanceRef.current.setMoodColor(moodColor)
    }
  }, [moodColor])

  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden', cursor: 'grab' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          right: 12,
          fontSize: '0.68rem',
          color: 'rgba(255,255,255,0.45)',
          pointerEvents: 'none',
          background: 'rgba(0,0,0,0.4)',
          padding: '2px 8px',
          borderRadius: 99,
          backdropFilter: 'blur(4px)',
        }}
      >
        👆 Drag to rotate 3D
      </div>
    </div>
  )
}
