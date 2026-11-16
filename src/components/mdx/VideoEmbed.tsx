// 16:9 Vimeo (or any iframe player) embed for case-study MDX bodies.
// Pass the full player URL, including any autoplay/loop query params.
// `ratio` overrides the 16:9 frame for embeds with their own chrome
// (e.g. a LinkedIn post embed is 504 / 399).
interface VideoEmbedProps {
    src: string
    title: string
    ratio?: string
}

export function VideoEmbed({ src, title, ratio }: VideoEmbedProps) {
    return (
        <div className="video-embed" style={ratio ? { aspectRatio: ratio } : undefined}>
            <iframe
                src={src}
                title={title}
                loading="lazy"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
            />
        </div>
    )
}
