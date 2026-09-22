import { useEffect, useState } from 'react'
import api from '../api/axios'
import Loader from '../components/Loader'
import HeroSection from '../components/sections/HeroSection'
import AboutSection from '../components/sections/AboutSection'
import ProjectsSection from '../components/sections/ProjectsSection'
import SkillsSection from '../components/sections/SkillsSection'
import CertificatesSection from '../components/sections/CertificatesSection'
import ContactSection from '../components/sections/ContactSection'
import Footer from '../components/Footer'

export default function HomePage() {
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [certificates, setCertificates] = useState([])
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    let loaded = 0
    const total = 4

    const tick = () => {
      loaded++
      const pct = Math.round((loaded / total) * 100)
      setProgress(pct)
      if (loaded === total) {
        // small pause so 100% is visible, then fade
        setTimeout(() => {
          setFadeOut(true)
          setTimeout(() => setReady(true), 600)
        }, 400)
      }
    }

    api.get('/profile').then(r => setProfile(r.data)).catch(() => {}).finally(tick)
    api.get('/projects').then(r => setProjects(r.data)).catch(() => {}).finally(tick)
    api.get('/skills').then(r => setSkills(r.data)).catch(() => {}).finally(tick)
    api.get('/certificates').then(r => setCertificates(r.data)).catch(() => {}).finally(tick)
  }, [])

  if (!ready) {
    return (
      <div style={{ opacity: fadeOut ? 0 : 1, transition: 'opacity 0.6s ease' }}>
        <Loader progress={progress} />
      </div>
    )
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
      <HeroSection profile={profile} />
      <AboutSection profile={profile} />
      <ProjectsSection projects={projects} />
      <SkillsSection skills={skills} />
      <CertificatesSection certificates={certificates} />
      <ContactSection />
      <Footer profile={profile} />
    </div>
  )
}