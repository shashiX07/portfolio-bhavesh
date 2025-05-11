"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Project {
  image?: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
}

export default function ProjectCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="group relative overflow-hidden rounded-lg bg-zinc-800 border border-zinc-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isHovered ? "opacity-70" : "opacity-0"}`}
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
        <p className="text-gray-300 mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag : any) => (
            <Badge key={tag} variant="outline" className="border-emerald-500/30 text-emerald-400 bg-transparent">
              {tag}
            </Badge>
          ))}
        </div>

        <Button asChild variant="ghost" className="group/button hover:bg-emerald-500/20 text-emerald-400">
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            View Project
            <ExternalLink className="ml-2 w-4 h-4 transition-transform group-hover/button:translate-x-1" />
          </a>
        </Button>
      </div>
    </motion.div>
  )
}
