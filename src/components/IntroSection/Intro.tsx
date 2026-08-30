//Self intro

import './Intro.css';
import { ArrowUp } from '../icons/ArrowUp';

export function Intro(){
    return(
        <div className="intro-section">
            <div>
            <h1>Skylar Wang</h1>
            <div className="divider-sm"></div>
            </div>
            <p className="body-lg width-800">is a product designer and software builder who makes softwares feel handmade.</p>
            <button
                type="button"
                className="intro-image"
                
                onClick={() => console.log('image clicked')}
                aria-label="Toggle phone preview"
            />

            <div className="contact-me-tag">
                <p className="t-meta text-inverse no-margin">Contact me</p>
                <ArrowUp width="16" height="16" stroke="var(--c-cream)"/>
                </div>

            <div className="flex-vertical gap-8">
            <p className="t-meta no-margin">NOW / Product Design @ Worldpay</p>
            <p className="t-meta no-margin">PREV / Interaction Design @ GE Appliances</p>
            </div>
        </div>
    )
}