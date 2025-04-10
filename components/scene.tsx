"use client"

import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Text3D } from "@react-three/drei"
import { useTheme } from "next-themes"

export default function Scene() {
  const { theme } = useTheme()
  const logoRef = useRef()
  const { viewport } = useThree()

  // Create a single animated 3D logo
  useFrame((state, delta) => {
    if (logoRef.current) {
      logoRef.current.rotation.y += delta * 0.2
      logoRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <group>
      <group ref={logoRef} position={[0, 0, 0]} scale={[1.5, 1.5, 1.5]}>
        <mesh castShadow receiveShadow>
          <torusKnotGeometry args={[1, 0.3, 128, 32, 2, 3]} />
          <meshStandardMaterial
            color={theme === "dark" ? "#10b981" : "#059669"}
            metalness={0.7}
            roughness={0.2}
            emissive={theme === "dark" ? "#10b981" : "#059669"}
            emissiveIntensity={0.3}
          />
        </mesh>

        <mesh position={[0, 0, 0]} scale={[0.8, 0.8, 0.8]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color={theme === "dark" ? "#ffffff" : "#000000"}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>

      <Text3D font="/fonts/Inter_Bold.json" size={0.4} height={0.1} curveSegments={12} position={[-1.5, -2, 0]}>
        Portfolio
        <meshStandardMaterial color={theme === "dark" ? "#10b981" : "#059669"} metalness={0.5} roughness={0.3} />
      </Text3D>
    </group>
  )
}
