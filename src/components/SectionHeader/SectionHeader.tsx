interface SectionHeaderProps {
    number: string
    title: string
}

export function SectionHeader({number, title}: SectionHeaderProps){

    return (
        <div className="flex-vertical gap-8">
            <div className="flex-horizontal gap-8">
            <h2>{number}.</h2>
            <h2>{title}</h2>
            </div>
            <hr />
        </div>
    )
}