import { cn } from '@/lib/utils';

type HeadingTagsType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingLevelType = 's' | 'm' | 'l' | 'xl' | 'xxl';
type TextAlignType = 'left' | 'center' | 'right';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    as: HeadingTagsType;
    level: HeadingLevelType;
    children: React.ReactNode | string;
    textAlign?: TextAlignType;
    className?: string;
}

const headingVariants = {
    levels: {
        s: 'text-lg leading-[100%] md:text-xl',
        m: 'text-xl leading-[100%] md:text-2xl',
        l: 'text-2xl leading-[100%] md:text-[32px]',
        xl: 'text-[32px] leading-[100%] md:text-[38px]',
        xxl: 'text-[38px] leading-[100%] md:text-5xl',
    },
    align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    },
};

export function Heading({
    as,
    level,
    children,
    textAlign = 'left',
    className = '',
    ...props
}: HeadingProps) {
    const Comp = as || 'h3';
    const classNames = cn(
        // Base styles
        'font-bebas text-balance',
        // Rich text styles
        '[&_strong]:font-bold [&_b]:font-bold [&_i]:italic',
        // Variant styles
        headingVariants.levels[level],
        headingVariants.align[textAlign],
        // Extra classes
        className,
    );

    const isString = typeof children === 'string';

    return (
        <Comp className={classNames} {...props}>
            {isString ? (
                <span dangerouslySetInnerHTML={{ __html: children }} />
            ) : (
                children
            )}
        </Comp>
    );
}
