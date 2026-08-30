// Arrow icon pointing up-and-to-the-right 
// Defaults to currentColor so CSS `color` controls the stroke;
// pass a `stroke` prop to override with a specific color.

type Props = React.SVGProps<SVGSVGElement>;

export function ArrowUp({
    width = 20,
    height = 20,
    stroke = 'currentColor',
    strokeWidth = 2,
    ...props
}: Props) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            {...props}
        >
            <path
                d="M14.1663 14.1666V5.83325H5.83301M14.1663 5.83325L5.83301 14.1666"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
