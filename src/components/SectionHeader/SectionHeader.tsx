interface SectionHeaderProps {
    number: string
    title: string
    subtitle?: string
}

export function SectionHeader({number, title, subtitle}: SectionHeaderProps){

    return (
        <div className="flex-vertical gap-20">
            <div className="flex-horizontal gap-8">
            <h3 className="accent-color">{number}.</h3>
            <h3>{title}</h3>
            </div>
            {subtitle && <p className="t-meta no-margin">{subtitle}</p>}
            <hr className="dark-top-border" />
        </div>
    )
}
