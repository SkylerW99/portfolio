import './Landing.css'
import { useMemo, useEffect, useRef, useState } from 'react'
import { projects } from '../../content/generated-index'
import { useOpenProjectModal } from '../../content/filters'
import { ProjectCardText } from '../../components/ProjectCard/ProjectCard'
import { ProjectCardImage } from '../../components/ProjectCard/ProjectCard'
import { ProjectModal } from '../../components/ProjectModal/ProjectModal'
import { TopNav } from '../../components/topNav/topNav'
import { Intro } from '../../components/IntroSection/Intro'
import { ArrowUp } from '../../components/icons/ArrowUp'
import { Footer } from '../../components/Footer/footer'

export function Component() {
  const handleOpenModal = useOpenProjectModal() //
  const featuredLargeProjects = useMemo(() => projects.filter((project) => project.featured && project.size === "large"), [])
  const featuredSmallProjects = useMemo(() => projects.filter((project) => project.featured && project.size === "small"), [])
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
      {/* Featured Projects */}
      <section className="flex-vertical gap-64">
        <section className="featured-projects-container">
          <div className="left-section flex-vertical">
            <ProjectCardText project={featuredLargeProjects[activeIndex]} />
            <ul className="dots">
              {featuredLargeProjects.map((project, i) => (
                <li key={project.slug} className={`dot ${i === activeIndex ? 'is-active' : ''}`} />
              ))}
            </ul>
          </div>
          <div className="right-section">
            {featuredLargeProjects.map((project, i) => (
              <div
                ref={(el) => { blockRefs.current[i] = el }}
                data-index={i}
              >
                <ProjectCardImage key={project.slug} project={project} />
              </div>
            ))}
          </div>
        </section>

      {/* Art and Tech */}
        <section className="flex-vertical gap-40">
          <div className="flex-horizontal space-between align-center">
            <div className="flex-vertical gap-12">
              <div className="gap-0 flex-vertical">
                <p className="t-meta accent-color">Art & Tech</p>
                <h3>Code, Interactivity & Form</h3>
              </div>
              <p className="body-sm">Checkout my latest web development, creative coding, and interactive art work.</p>
            </div>
            <button className="btn">More Works
              <ArrowUp width="16" height="16" />
            </button>
          </div>
          <div className="grid-two-column">
            {featuredSmallProjects.map((project) => (
              <ProjectCardImage key={project.slug} project={project} onOpenModal={handleOpenModal} />
            ))}
          </div>
        </section>

      {/* Footer */}
        <section className="gap-64 dark-top-border padding-64">
          <Footer />
        </section>
      </section>


        <ProjectModal />
    </div>
  )
}
