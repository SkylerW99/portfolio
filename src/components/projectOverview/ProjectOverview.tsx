import './ProjectOverview.css'

// this component is for the project overview section
interface ProjectOverviewProps {
    title: string
    description: string
    projectType: string
    team: string
    duration: string
    /** Optional: the My Role column is hidden when omitted. */
    myRole?: string
}

export function ProjectOverview({
    title,
    description,
    projectType,
    team,
    duration,
    myRole,
}: ProjectOverviewProps) {
    return (
        <section className="project-overview">
            <h1>{title}</h1>
            <p className="body-lg">{description}</p>
            <div className="project-overview__meta">

                <div>
                <p className="t-eyebrow">Project Type</p>
                <p className="body-md">{projectType}</p>
                </div>

                <div>
                <p className="t-eyebrow">Team</p>
                <p className="body-md">{team}</p>
                </div>

                <div>
                <p className="t-eyebrow">Duration</p>
                <p className="body-md">{duration}</p>
                </div>

                {myRole && (
                <div>
                <p className="t-eyebrow">My Role</p>
                <p className="body-md">{myRole}</p>
                </div>
                )}
            
            </div>
        </section>
    )
}