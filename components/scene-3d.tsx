"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

export default function Scene3D() {
  const torusRef = useRef()

  // Create a single animated 3D element
  useFrame((state, delta) => {
    if (torusRef.current) {
      torusRef.current.rotation.y += delta * 0.2
      torusRef.current.rotation.x += delta * 0.1
    }
  })

  return (
    <group>
      <mesh ref={torusRef} position={[0, 0, 0]}>
        <torusKnotGeometry args={[1.5, 0.5, 128, 32, 2, 3]} />
        <meshStandardMaterial
          color="#10b981"
          metalness={0.7}
          roughness={0.2}
          emissive="#10b981"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  )
}
