// 16:9 Vimeo (or any iframe player) embed for case-study MDX bodies.
// Pass the full player URL, including any autoplay/loop query params.
interface VideoEmbedProps {
    src: string
    title: string
}

export function VideoEmbed({ src, title }: VideoEmbedProps) {
    return (
        <div className="video-embed">
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
