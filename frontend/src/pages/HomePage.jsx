// src/pages/HomePage.jsx
import { useEffect, useState } from 'react'
import api from '../api/axios'
import HeroSection from '../components/sections/HeroSection'
import AboutSection from '../components/sections/AboutSection'
import ProjectsSection from '../components/sections/ProjectsSection'
import SkillsSection from '../components/sections/SkillsSection'
import ContactSection from '../components/sections/ContactSection'
import Footer from '../components/Footer'

export default function HomePage() {
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])

  useEffect(() => {
    api.get('/profile').then(r => setProfile(r.data)).catch(() => {})
    api.get('/projects').then(r => setProjects(r.data)).catch(() => {})
    api.get('/skills').then(r => setSkills(r.data)).catch(() => {})
  }, [])

  return (
    <>
      <HeroSection profile={profile} />
      <AboutSection profile={profile} />
      <ProjectsSection projects={projects} />
      <SkillsSection skills={skills} />
      <ContactSection />
      <Footer profile={profile} />
    </>
  )
}