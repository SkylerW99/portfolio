// About pop-up (route /about): portrait on the left; bio, experience, skills,
// awards and education on the right; résumé / contact in the footer row.

import { Popup } from '../Popup/Popup'
import './AboutModal.css'
import { RESUME_URL } from '../../content/contact'
import { awards, bio, education, experience, skills } from '../../content/about'

type Props = {
  open: boolean
  onClose: () => void
  onContact: () => void
}

function SectionHead({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="t-meta about__head"><span className="text-primary-col">{title}</span><span>{meta}</span></div>
  )
}

export function AboutModal({ open, onClose, onContact }: Props) {
  return (
    <Popup
      open={open}
      onClose={onClose}
      label="About Skylar Wang"
      heading="About — Product designer // Technologist"
      className="about"
      media={
        <>
          <img className="about__photo" src="/images/Personal/myPhoto.png" alt="Portrait of Skylar Ziyi Wang" />
          <div className="t-meta about__caption"><span>Skylar / Ziyi Wang</span><span>Dallas, TX</span></div>
        </>
      }
      footer={
        <>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer"><span>My résumé</span><span aria-hidden="true">↗</span></a>
          <button type="button" onClick={onContact}><span>Contact me</span><span aria-hidden="true">↗</span></button>
        </>
      }
    >
      <div className="about__intro">
        <h2 className="about__name" lang="en">{bio.name} <span lang="zh">{bio.nameZh}</span></h2>
        <p className="about__lead">{bio.lead}</p>
        {bio.paras.map((p) => <p key={p} className="about__p">{p}</p>)}
      </div>

      <section className="about__section">
        <SectionHead title="Experience" meta="Product · interaction · creative tech" />
        {experience.map((group) => (
          <div key={group.label} className="about__group">
            <div className="t-meta">{group.label}</div>
            {group.items.map((x) => (
              <article key={x.role + x.org} className="about__role">
                <div className="about__role-head">
                  <span className="about__role-title"><span className="about__role-name">{x.role}</span><span className="t-meta">{x.org}</span></span>
                  <span className="t-meta about__role-when">{x.when}<br />{x.where}</span>
                </div>
                <ul className="about__points">
                  {x.points.map((pt) => <li key={pt}><span aria-hidden="true">—</span><span>{pt}</span></li>)}
                </ul>
              </article>
            ))}
          </div>
        ))}
      </section>

      <section className="about__section about__section--tight">
        <SectionHead title="Skills" meta="Design · Tech · Research" />
        {skills.map((sk) => (
          <div key={sk.title} className="about__skill">
            <span className="t-meta">{sk.title}</span>
            <span>{sk.items.join(' · ')}</span>
          </div>
        ))}
      </section>

      <section className="about__section about__section--list">
        <SectionHead title="Awards & exhibitions" meta={String(awards.length).padStart(2, '0')} />
        {awards.map((aw) => (
          <div key={aw.event} className="about__row">
            <span className="about__row-title">{aw.event}</span>
            <span className="t-meta">{aw.result}</span>
            <span className="about__row-sub about__row-sub--full">{aw.work}</span>
          </div>
        ))}
      </section>

      <section className="about__section about__section--list">
        <SectionHead title="Education" meta={String(education.length).padStart(2, '0')} />
        {education.map((ed) => (
          <div key={ed.school} className="about__row">
            <span className="about__row-title">{ed.school}</span>
            <span className="t-meta">{ed.when}</span>
            <span className="about__row-sub">{ed.degree}</span>
            <span className="t-meta about__row-note">{ed.note}</span>
          </div>
        ))}
      </section>

      <p className="about__signoff">Let’s make something <em>handmade.</em></p>
    </Popup>
  )
}
