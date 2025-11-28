import { clsx, type ClassValue } from 'clsx';
import { Check, Loader, Sparkles, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind classes
 */
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Status type for the FloatingActionButton
 */
export type FloatingActionButtonStatus = 'idle' | 'processing' | 'success' | 'error';

/**
 * Props for FloatingActionButton component
 */
export interface FloatingActionButtonProps {
    /** Current status of the button */
    status: FloatingActionButtonStatus;
    /** Click handler */
    onClick?: () => void;
    /** Additional CSS classes */
    className?: string;
    /** Whether the button is disabled */
    disabled?: boolean;
}

/**
 * Configuration for each button status
 */
const statusConfig: Record<
    FloatingActionButtonStatus,
    {
        icon: React.ReactNode;
        text: string;
        bgClass: string;
        hoverBgClass: string;
    }
> = {
    idle: {
        icon: <Sparkles size={16} />,
        text: 'Extract',
        bgClass: 'bg-button-idle',
        hoverBgClass: 'hover:bg-button-hover',
    },
    processing: {
        icon: <Loader size={16} className="animate-spin" />,
        text: 'Extracting...',
        bgClass: 'bg-button-processing',
        hoverBgClass: '',
    },
    success: {
        icon: <Check size={16} />,
        text: 'Extracted',
        bgClass: 'bg-button-success',
        hoverBgClass: '',
    },
    error: {
        icon: <X size={16} />,
        text: 'Error',
        bgClass: 'bg-button-error',
        hoverBgClass: '',
    },
};

/**
 * FloatingActionButton - A fixed-position button for triggering extraction
 *
 * Displays different visual states based on the status prop:
 * - idle: Purple gradient, clickable
 * - processing: Pink gradient, spinning loader
 * - success: Green gradient, checkmark
 * - error: Red gradient, X icon
 */
export function FloatingActionButton({
    status,
    onClick,
    className,
    disabled = false,
}: FloatingActionButtonProps) {
    const config = statusConfig[status];
    const isInteractive = status === 'idle' && !disabled;

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled || status === 'processing'}
            className={cn(
                // Base styles
                'fixed bottom-5 right-5 z-[10000]',
                'px-5 py-3',
                'rounded-lg',
                'text-white text-sm font-semibold',
                'flex items-center gap-2',
                'transition-all duration-300 ease-out',
                'shadow-fab',
                'font-[-apple-system,BlinkMacSystemFont,"Segoe_UI",Roboto,sans-serif]',

                // Background gradient based on status
                config.bgClass,

                // Hover effects (only for idle state)
                isInteractive && [
                    config.hoverBgClass,
                    'hover:-translate-y-0.5',
                    'hover:shadow-fab-hover',
                    'cursor-pointer',
                ],

                // Active/pressed effects
                isInteractive && [
                    'active:translate-y-0',
                    'active:shadow-fab-active',
                ],

                // Processing state cursor
                status === 'processing' && 'cursor-wait',

                // Disabled state
                disabled && 'opacity-50 cursor-not-allowed',

                className
            )}
        >
            <span className="flex-shrink-0">{config.icon}</span>
            <span>{config.text}</span>
        </button>
    );
}

export default FloatingActionButton;
