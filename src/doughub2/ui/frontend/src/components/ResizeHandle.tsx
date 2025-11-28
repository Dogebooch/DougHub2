/**
 * ResizeHandle Component
 *
 * A draggable handle for resizing adjacent panels, similar to VS Code's panel resizers.
 * Supports both horizontal (left-right) and vertical (top-bottom) resizing.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface ResizeHandleProps {
    /** Direction of resize - horizontal splits left/right, vertical splits top/bottom */
    direction: 'horizontal' | 'vertical';
    /** Callback when resize occurs, provides delta in pixels */
    onResize: (delta: number) => void;
    /** Optional callback when resize starts */
    onResizeStart?: () => void;
    /** Optional callback when resize ends */
    onResizeEnd?: () => void;
}

export function ResizeHandle({
    direction,
    onResize,
    onResizeStart,
    onResizeEnd,
}: ResizeHandleProps) {
    const [isDragging, setIsDragging] = useState(false);
    const lastPositionRef = useRef<number>(0);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            setIsDragging(true);
            lastPositionRef.current = direction === 'horizontal' ? e.clientX : e.clientY;
            onResizeStart?.();
        },
        [direction, onResizeStart]
    );

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            const currentPosition = direction === 'horizontal' ? e.clientX : e.clientY;
            const delta = currentPosition - lastPositionRef.current;
            lastPositionRef.current = currentPosition;
            onResize(delta);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            onResizeEnd?.();
        };

        // Add listeners to document to capture mouse events outside the handle
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // Change cursor globally while dragging
        document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
        document.body.style.userSelect = 'none';

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging, direction, onResize, onResizeEnd]);

    const isHorizontal = direction === 'horizontal';

    return (
        <div
            onMouseDown={handleMouseDown}
            className={`
                group relative flex-shrink-0
                ${isHorizontal ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize'}
                ${isDragging ? 'bg-emerald-500' : 'bg-[#2A3038] hover:bg-emerald-500/50'}
                transition-colors duration-75
            `}
        >
            {/* Larger invisible hit area for easier grabbing */}
            <div
                className={`
                    absolute
                    ${isHorizontal
                        ? 'inset-y-0 -left-1 -right-1 w-3'
                        : 'inset-x-0 -top-1 -bottom-1 h-3'
                    }
                `}
            />

            {/* Visual indicator dots (shown on hover) */}
            <div
                className={`
                    absolute opacity-0 group-hover:opacity-100 transition-opacity
                    ${isHorizontal
                        ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1'
                        : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-row gap-1'
                    }
                `}
            >
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <div className="w-1 h-1 rounded-full bg-gray-400" />
            </div>
        </div>
    );
}

export default ResizeHandle;
