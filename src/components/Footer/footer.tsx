import { Link } from "react-router-dom"
import { ArrowUp } from "../icons/ArrowUp"
import "./footer.css"

export function Footer(){

    //update the year dynamically
    function getCurrentYear():number{
        const currentDate = new Date();
        return currentDate.getFullYear();
    }

    return(
        <div className="flex-horizontal space-between">
            <div className="flex-vertical gap-4">
                <p className="t-eyebrow text-primary-col">About this site</p>
                <p className="body-sm">Made across Shanghai, New York, and Dallas. <br/>
                    Last updated in 2026.</p>
            </div>

            <div className="flex-vertical">
                <p className="t-eyebrow text-primary-col">Links</p>
                <div className="flex-vertical gap-4">
                <a className="body-sm">Email<ArrowUp width="16" height="16"/></a>
                <a className="body-sm">LinkedIn<ArrowUp width="16" height="16"/></a>
                <a className="body-sm">Résumé <ArrowUp width="16" height="16"/></a>
                <a className="body-sm">Github <ArrowUp width="16" height="16"/></a>
                </div>
            </div>

            <div className="flex-vertical gap-8">
                <h2 className="h2-italic">Say hi.</h2>
                <p className="t-nav">© SKYW {getCurrentYear()}  —  NO COOKIES</p>
            </div>

        </div>
    )
}