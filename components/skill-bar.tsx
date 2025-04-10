"use client"

import { motion } from "framer-motion"

export default function SkillBar({ name, level }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="font-medium text-white">{name}</span>
        <span className="text-emerald-400">{level}%</span>
      </div>
      <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-emerald-500 rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      </div>
    </div>
  )
}
