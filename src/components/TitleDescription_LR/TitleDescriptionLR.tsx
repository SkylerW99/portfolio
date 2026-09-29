interface TitleDescriptionProps {
    //section title
    subtitle?: string
    title: string
    //left section
    subtitleLeft?: string
    titleLeft?: string
    bodyLeft?: string
    imageLeft?: string
    //right section
    subtitleRight?: string
    titleRight?: string
    bodyRight?: string
    imageRight?: string
}

export function TitleDescriptionLR({ subtitle, title, subtitleLeft, titleLeft, bodyLeft, imageLeft, subtitleRight, titleRight, bodyRight, imageRight }: TitleDescriptionProps) {

    return (
        <div>
            <p className="t-meta">{subtitle}</p>
            <h3>{title}</h3>
            <div className="grid-two-column">
                <div>
                    <p className="t-meta">{subtitleLeft}</p>
                    <h4>{titleLeft}</h4>
                    <p className="body-sm"> {bodyLeft} </p>
                    <img src={imageLeft} style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>

                <div>
                    <p className="t-meta">{subtitleRight}</p>
                    <h4>{titleRight}</h4>
                    <p className="body-sm"> {bodyRight} </p>
                    <img src={imageRight} style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>

            </div>
        </div>

    );
}