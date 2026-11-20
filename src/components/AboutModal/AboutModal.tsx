// About pop-up (route /about): portrait on the left; bio (with résumé / contact
// buttons), experience, skills, awards and education on the right; Close in the footer.
// Each role and award links to its projects: a case study page, the password pop-up
// for a locked one, or the art pop-up for a small project.

import { useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { Popup } from '../Popup/Popup'
import './AboutModal.css'
import { RESUME_URL } from '../../content/contact'
import { awards, bio, education, experience, skills } from '../../content/about'
import { isCaseStudy, projects } from '../../content/projects'
import { PROJECT_PARAM, UNLOCK_PARAM } from '../../content/filters'
import { isLocked } from '../../content/unlock'

// Links keep you "inside" About: small projects and the password screen open as
// /about?project= / ?unlock= (About hides until they close), and case studies get
// state.from = '/about' so their ✕ comes back here.
function projectLink(slug: string) {
  const p = projects.find((x) => x.slug === slug)
  if (!p) return null
  const to = !isCaseStudy(p) ? `/about?${PROJECT_PARAM}=${slug}` : isLocked(p) ? `/about?${UNLOCK_PARAM}=${slug}` : `/work/${slug}`
  return { to, title: p.title }
}
const FROM_ABOUT = { from: '/about' }

// Scroll position of About's text column, saved when a project link is followed and
// restored once when About reopens, so coming back lands where you left off.
// Closing About normally doesn't save, so a fresh visit starts at the top.
let savedScroll: number | null = null
const aboutBody = () => document.querySelector<HTMLElement>('.about .popup__body')
const rememberScroll = () => { savedScroll = aboutBody()?.scrollTop ?? null }

type Props = {
  open: boolean
  onClose: () => void
  onContact: () => void
}

function SectionHead({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="t-meta about__head"><span className="text-primary-col">{title}</span>{meta && <span>{meta}</span>}</div>
  )
}

export function AboutModal({ open, onClose, onContact }: Props) {
  useLayoutEffect(() => {
    if (!open || savedScroll === null) return
    const y = savedScroll
    savedScroll = null
    const body = aboutBody()
    if (body) body.scrollTop = y
  }, [open])

  return (
    <Popup
      open={open}
      onClose={onClose}
      label="About Skylar Wang"
      heading="About — Product designer // Technologist"
      className="about"
      media={
        <>
          <div className="about__photos">
            <img className="about__photo" src="/images/Personal/photo-1.jpg" alt="Skylar standing under trees in a park, looking up" />
            <img className="about__photo" src="/images/Personal/photo-2.jpg" alt="Skylar smiling by a river with a city skyline behind" />
          </div>
        </>
      }
      footer={<button type="button" className="about__close" onClick={onClose}>Close</button>}
    >
      <div className="about__intro">
        <h2 className="about__name" lang="en">{bio.name} <span lang="zh">{bio.nameZh}</span></h2>
        <p className="about__lead">{bio.lead}</p>
        {bio.paras.map((p) => <p key={p} className="about__p">{p}</p>)}
        <div className="btn-group">
          <a className="btn btn--sm" href={RESUME_URL} target="_blank" rel="noopener noreferrer">My résumé ↗</a>
          <button type="button" className="btn btn--sm" onClick={onContact}>Contact me ↗</button>
        </div>
      </div>

      <section className="about__section">
        <SectionHead title="Key experience" />
        {experience.map((group) => (
          <div key={group.label} className="about__group">
            <div className="t-meta">{group.label}</div>
            {group.items.map((x) => (
              <article key={x.role + x.org} className="about__role">
                <div className="about__role-head">
                  <div className="about__role-title">
                    <span className="about__role-name">{x.role}</span>
                    <span className="about__role-org">{x.org}</span>
                  </div>
                  <span className="t-meta about__role-when">{x.when}<br />{x.where}</span>
                </div>
                {x.projects.length > 0 && (
                  <ol className="about__points">
                    {x.projects.map((slug, i) => {
                      const l = projectLink(slug)
                      return l && (
                        <li key={slug}>
                          <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                          <Link className="about__proj" to={l.to} state={FROM_ABOUT} onClick={rememberScroll}>{l.title} →</Link>
                        </li>
                      )
                    })}
                  </ol>
                )}
              </article>
            ))}
          </div>
        ))}
      </section>

      <section className="about__section about__section--tight">
        <SectionHead title="Skills" />
        {skills.map((sk) => (
          <div key={sk.title} className="about__skill">
            <span className="t-meta">{sk.title}</span>
            <span>{sk.items.join(' · ')}</span>
          </div>
        ))}
      </section>

      <section className="about__section about__section--list">
        <SectionHead title="Awards & exhibitions" />
        {awards.map((aw) => (
          <div key={aw.event} className="about__row">
            <span className="about__row-title">{aw.event}</span>
            <span className="t-meta">{aw.result}</span>
            {(() => {
              const l = projectLink(aw.slug)
              return l
                ? <Link className="about__row-sub about__row-sub--full about__proj" to={l.to} state={FROM_ABOUT} onClick={rememberScroll}>{aw.work} →</Link>
                : <span className="about__row-sub about__row-sub--full">{aw.work}</span>
            })()}
          </div>
        ))}
      </section>

      <section className="about__section about__section--list">
        <SectionHead title="Education" />
        {education.map((ed) => (
          <div key={ed.school} className="about__row">
            <span className="about__row-title">{ed.school}</span>
            <span className="t-meta">{ed.when}</span>
            <span className="about__row-sub">{ed.degree}</span>
          </div>
        ))}
      </section>

      <p className="about__signoff">Let’s build some <em>cool stuff</em> together.</p>
    </Popup>
  )
}
