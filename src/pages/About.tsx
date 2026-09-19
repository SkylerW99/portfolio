import { TopNav } from "../components/topNav/topNav"
import { ArrowUp } from "../components/icons/ArrowUp"
import myStack from '../../public/myStack.json';
import {useState} from "react";

export function Component() {

  const [skill, setSkill] = useState({"name": "undefined", "image": "undefined" });

  const handleClick = (item:{name:string, image: string}) => {
    setSkill(item);
  }

  return (
    <div className="page-container">
      <TopNav />
      {/*Self Intro*/}
      <section className="grid-two-column padding-64">
        <img src="/images/Personal/myPhoto.png" style={{ width: '100%', height: 'auto' }} alt="Profile image for the portfolio owner on the About page; no visible text or wider environment is specified." />
        <div className="flex-vertical gap-12">
          <h1>About me</h1>
          <p>Skylar / Ziyi is an interaction designer and creative technologist born in Shanghai, currently based between NYC and Dallas. By day, she work in fintech, untangling complex payment systems and turning them into simplified user experience. By night, she explore new ways of storytelling through code, design, writing, and physical making. She's drawn to the in-between spaces where abstract systems and ideology meets stories. She create experience that feel poetic, yet understandable, and emotionally resonant. Her work explores language, culture, social phenomenon, and our evolving relationship with technology and the natural world.</p>
          <div className="flex-vertical">
            <p className="t-eyebrow text-primary-col">Links</p>
            <div className="flex-vertical gap-4">
              <a className="body-sm">Email<ArrowUp width="16" height="16" /></a>
              <a className="body-sm">LinkedIn<ArrowUp width="16" height="16" /></a>
              <a className="body-sm">Résumé <ArrowUp width="16" height="16" /></a>
              <a className="body-sm">Github <ArrowUp width="16" height="16" /></a>
            </div>
          </div>
        </div>
      </section>
      {/* My Stack*/}
      <section>
        <h1>My Stack</h1>
        <p className="t-meta">Select a skill to view more details.</p>
        <div className="grid-two-column">
          <div>
          <h3>Design</h3>
          <p>Skill Name</p>
          {myStack.map((item) => {
            return (
              <button className="btn" key={item.name} onClick={() => handleClick(item)} aria-pressed= {item.name === skill.name}> {item.name} </button>
            )
          })}
          </div>

          <div>
            <h3>image</h3>
            <div>
            {skill.image === "undefined"
              ? "select a skill on the left to view details"
              : <img src={skill.image} alt={skill.name} width="300"/>
            }
            </div>
            
          </div>
        </div>
      </section>
    </div>
  )
}
