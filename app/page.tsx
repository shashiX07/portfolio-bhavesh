"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, PresentationControls, Float } from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowDown, ArrowUp, ExternalLink, Github, Linkedin, Mail, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import Scene3D from "@/components/scene-3d"
import ProjectCard from "@/components/project-card"
import SkillBar from "@/components/skill-bar"
import ScrollIndicator from "@/components/scroll-indicator"

export default function Home() {
  const [activeSection, setActiveSection] = useState("home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const sections = ["home", "projects", "skills", "contact"]
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    loading: false,
    success: false,
    error: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (!element) continue

        const { offsetTop, offsetHeight } = element
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(section)
          break
        }
      }

      // Reveal animations on scroll
      const reveals = document.querySelectorAll(".reveal")
      reveals.forEach((reveal) => {
        const windowHeight = window.innerHeight
        const revealTop = reveal.getBoundingClientRect().top
        const revealPoint = 150

        if (revealTop < windowHeight - revealPoint) {
          reveal.classList.add("active")
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  useEffect(() => {
    const handleScrollVisibility = () => {
      if (window.pageYOffset > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener("scroll", handleScrollVisibility)
    return () => window.removeEventListener("scroll", handleScrollVisibility)
  }, [])

  const scrollToSection = (section : any) => {
    const element = document.getElementById(section)
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      })
      setActiveSection(section)
      setMobileMenuOpen(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        loading: false,
        success: false,
        error: 'Please fill all fields'
      });
      return;
    }
    
    try {
      setFormStatus({ loading: true, success: false, error: '' });
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      // First check if response is ok before trying to parse as JSON
      if (!response.ok) {
        // Try to get error as JSON but handle non-JSON errors too
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || `Request failed with status ${response.status}`);
        } catch (jsonError) {
          // If JSON parsing fails, use status text
          throw new Error(`Request failed: ${response.statusText || response.status}`);
        }
      }
      
      const data = await response.json();
      
      // Success
      setFormStatus({
        loading: false,
        success: true,
        error: ''
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormStatus(prev => ({ ...prev, success: false }));
      }, 5000);
      
    } catch (error) {
      setFormStatus({
        loading: false,
        success: false,
        error: (error as Error).message
      });
      console.error('Form submission error:', error);
    }
  };

  const projects = [
    {
      title: "Adobe Premier Pro",
      description: "Prefessional Level Video edition using adobe Premier Pro",
      image: "premierpro.png",
      tags: ["Adobe", "Editing", "Video", "Graphics"],
      link: "https://www.instagram.com/bhavezyyy?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    },
    {
      title: "Coming Soon",
      description: "I keep boosting my skills and learning new things...more skills coming soon",
      image: "comingsoon.png",
      tags: ["Come-back-soon", "Learning", "Skills", "more"],
      link: "https://www.instagram.com/bhavezyyy?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    }
  ]

  const skills = [
    { name: "React", level: 95 },
    { name: "JavaScript", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Three.js", level: 80 },
    { name: "Figma", level: 75 },
    { name: "UI/UX Design", level: 85 },
    { name: "CSS/SCSS", level: 90 },
    { name: "Adobe PremierPro", level: 95 },
  ]

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <ScrollIndicator />
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold"
          >
            Portfolio<span className="text-emerald-400">.</span>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex space-x-8"
          >
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={cn(
                  "capitalize text-sm font-medium transition-colors",
                  activeSection === section ? "text-emerald-400" : "text-white hover:text-white/80",
                )}
              >
                {section}
              </button>
            ))}
          </motion.div>

          {/* Mobile Navigation Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/90 backdrop-blur-md"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                {sections.map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={cn(
                      "capitalize text-lg font-medium py-2 transition-colors",
                      activeSection === section ? "text-emerald-400" : "text-white/70 hover:text-white",
                    )}
                  >
                    {section}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen pt-12 md:pt-8 flex flex-col items-center justify-center relative">
        {/* Profile Picture */}
        <div className="mb-0 mt-16">
          <Avatar className="h-32 w-32 border-2 border-emerald-500 transition-all duration-300 hover:scale-105">
            <AvatarImage src="/profile.jpg" alt="Bhavesh Meena" />
            <AvatarFallback>Bhavesh</AvatarFallback>
          </Avatar>
        </div>

        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <motion.div
            className="z-10 order-2 md:order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              Creative <span className="text-emerald-400">Web Designer</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Crafting immersive digital experiences that blend creativity with technical excellence
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => scrollToSection("projects")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                View My Work
              </Button>
              <Button
                onClick={() => scrollToSection("contact")}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Get In Touch
              </Button>
            </div>
          </motion.div>

          {/* 3D Element */}
          <div className="h-[400px] md:h-[500px] w-full order-1 md:order-2">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <PresentationControls
                global
                zoom={0.8}
                rotation={[0, -Math.PI / 4, 0]}
                polar={[-Math.PI / 4, Math.PI / 4]}
                azimuth={[-Math.PI / 4, Math.PI / 4]}
              >
                <Float rotationIntensity={0.2} speed={2}>
                  <Scene3D />
                </Float>
              </PresentationControls>
              <Environment preset="city" />
            </Canvas>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <ArrowDown className="w-5 h-5 text-emerald-400 animate-bounce" />
        </motion.div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-zinc-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Featured Projects</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A selection of my most recent and impactful work across various industries and technologies
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="reveal"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-black relative">
        <div
          className="absolute inset-0 parallax opacity-5"
          style={{
            backgroundImage: "url('/placeholder.svg?height=1000&width=1000')",
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Skills & Expertise</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              My technical toolkit and creative capabilities that bring digital products to life
            </p>
          </motion.div>

          <Tabs defaultValue="technical" className="max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-zinc-800">
              <TabsTrigger
                value="technical"
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
              >
                Technical Skills
              </TabsTrigger>
              <TabsTrigger
                value="creative"
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
              >
                Creative Skills
              </TabsTrigger>
            </TabsList>
            <TabsContent value="technical">
              <Card className="border-zinc-700 bg-zinc-800/50 backdrop-blur-md">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {skills.slice(0, 4).map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <SkillBar name={skill.name} level={skill.level} />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="creative">
              <Card className="border-zinc-700 bg-zinc-800/50 backdrop-blur-md">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {skills.slice(4).map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <SkillBar name={skill.name} level={skill.level} />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-zinc-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Get In Touch</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Have a project in mind or want to collaborate? I'd love to hear from you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-white">Send Me a Message</h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-300">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1 text-gray-300">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                      placeholder="Tell me about your project..."
                    />
                  </div>
                </div>
                
                {formStatus.error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm">
                    {formStatus.error}
                  </div>
                )}
                
                {formStatus.success && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 rounded text-emerald-300 text-sm">
                    Your message has been sent successfully! I'll get back to you soon.
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                  disabled={formStatus.loading}
                >
                  {formStatus.loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold mb-6 text-white">Contact Information</h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 p-3 rounded-full">
                      <Mail className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-gray-300">umeshkumarmeena1234@gmail.com</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 p-3 rounded-full">
                      <Github className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-gray-300">designerx07</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 p-3 rounded-full">
                      <Linkedin className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-gray-300">Bhavesh Meena</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6 text-white">Let's Connect</h3>
                <p className="text-gray-300 mb-4">
                  Follow me on social media for updates on my latest projects and design insights
                </p>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-zinc-700 hover:bg-zinc-800 text-white"
                  >
                    <Github className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-zinc-700 hover:bg-zinc-800 text-white"
                  >
                    <Linkedin className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-zinc-700 hover:bg-zinc-800 text-white"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black border-t border-zinc-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
        </div>
      </footer>

      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-emerald-500 text-white shadow-lg z-50"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </main>
  )
}
