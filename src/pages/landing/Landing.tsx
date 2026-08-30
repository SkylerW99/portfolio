import './Landing.css'
import { useMemo, useEffect, useRef, useState } from 'react'
import { projects } from '../../content/generated-index'
import { useOpenProjectModal } from '../../content/filters'
import { ProjectCardText } from '../../components/ProjectCard/ProjectCard'
import { ProjectCardImage } from '../../components/ProjectCard/ProjectCard'
import { ProjectModal } from '../../components/ProjectModal'
import { TopNav } from '../../components/topNav/topNav'
import { Intro } from '../../components/IntroSection/Intro'

export function Component() {
  //const handleOpenModal = useOpenProjectModal()
  const featuredProjects = useMemo(() => projects.filter((project) => project.featured), [])
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([])

  //listen to scrolling progress
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'))
            setActiveIndex(index)
          }
        }
      },
      { rootMargin: '-33% 0px -33% 0px', threshold: 0 }
    )

    blockRefs.current.forEach((el) => el && observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="page-container">
      <TopNav />
      <Intro />
      <section className="featured-projects-container">
        <div className="left-section flex-vertical">
          <ProjectCardText project={featuredProjects[activeIndex]} />
          <ul className="dots">
          {featuredProjects.map((project,i)=>(
            <li key={project.slug} className={`dot ${i === activeIndex? 'is-active' : ''}`} />
          ))}
          </ul>
        </div>
        <div className="right-section">
          {featuredProjects.map((project, i) => (
            <div
              ref={(el) => { blockRefs.current[i] = el }}
              data-index={i}
            >
              <ProjectCardImage key={project.slug} project={project} />
            </div>
          ))}
        </div>
      </section>

      <ProjectModal />
    </div>
  )
}
