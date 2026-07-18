import type { SVGProps } from 'react';

interface IconProps {
    status: string;
    className?: string;
}

export const Icon = ({
    status,
    className,
}: IconProps): React.ReactElement | null => {
    const svgProps: SVGProps<SVGSVGElement> = {
        xmlns: 'http://www.w3.org/2000/svg',
        width: '24',
        height: '24',
        viewBox: '0 0 24 24',
        fill: 'none',
        className,
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
    };

    switch (status) {
        case 'success':
            return (
                <svg stroke="#2ecc71" {...svgProps}>
                    <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                    <path d="m9 11 3 3L22 4" />
                </svg>
            );

        case 'error':
            return (
                <svg stroke="#e74c3c" {...svgProps}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="m15 9-6 6" />
                    <path d="m9 9 6 6" />
                </svg>
            );
        default:
            return null;
    }
};
