import Link from 'next/link';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonType = 'button' | 'submit';

interface BaseButtonProps {
    variant: ButtonVariant;
    size: ButtonSize;
    onClick?: (e?: React.MouseEvent) => void;
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
}

// Props especificas para button
interface ButtonElementProps extends BaseButtonProps {
    as: 'button';
    buttonType?: ButtonType;
    type?: ButtonType;
}

// Props especificas para anchor
interface AnchorElementProps extends BaseButtonProps {
    as: 'a';
    href: string;
    target?: string;
}

type ButtonProps = ButtonElementProps | AnchorElementProps;

const buttonVariants = {
    variant: {
        primary: 'bg-red-600 hover:bg-red-700',
        secondary: 'bg-neutral-700 hover:bg-red-700',
        tertiary:
            'bg-neutral-100 text-neutral ring-1 ring-neutral-200 hover:bg-neutral-200',
    },
    size: {
        sm: 'py-1',
        md: 'py-2',
        lg: 'py-3',
    },
    loading: 'pointer-events-none text-white/40',
    disabled:
        'bg-neutral-300 text-neutral-500 pointer-events-none cursor-not-allowed',
};

export function Button({
    as = 'button',
    variant = 'primary',
    size = 'md',
    onClick,
    className = '',
    isLoading,
    children,
    ...props
}: ButtonProps) {
    const classNames = cn(
        // Base styles
        'flex justify-center items-center gap-2 relative font-bebas text-white font-bold text-lg leading-6 px-6 rounded-4xl transitio-colors duration-100 ease-in-out active:scale-97 cursor-pointer text-center',
        // Variant styles
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        // Loading state
        isLoading && buttonVariants.loading,
        // Disabled state
        props.disabled && buttonVariants.disabled,
        // Extra classes
        className,
    );

    const buttonContent: React.ReactElement = (
        <>
            {children}
            {isLoading && (
                <Spinner className="animate-spin-reverse absolute top-1/2 left-1/2 -translate-1/2" />
            )}
        </>
    );

    if (as === 'a') {
        const { href, target } = props as AnchorElementProps;
        return (
            <Link
                href={href}
                target={target}
                rel="noopener noreferrer"
                onClick={onClick}
                className={classNames}
            >
                {buttonContent}
            </Link>
        );
    }

    const { buttonType } = props as ButtonElementProps;
    return (
        <button
            type={buttonType}
            disabled={props.disabled}
            onClick={onClick}
            className={classNames}
        >
            {buttonContent}
        </button>
    );
}

function Spinner({ className = '' }: { className?: string }) {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M9.70065 14.4454C12.5607 13.692 14.6673 11.092 14.6673 7.9987C14.6673 4.3187 11.7073 1.33203 8.00065 1.33203C3.55398 1.33203 1.33398 5.0387 1.33398 5.0387M1.33398 5.0387V1.9987M1.33398 5.0387H2.67398H4.29398"
                stroke="#F1F1F1"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M1.33398 8C1.33398 11.68 4.32065 14.6667 8.00065 14.6667"
                stroke="#F1F1F1"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="3 3"
            />
        </svg>
    );
}
