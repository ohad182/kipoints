import { useEffect } from 'react';

/**
 *  Custom hook to handle ESC key press
 * @param {boolean} isOpen - Whether the modal/dialog is open
 * @param {function} onClose - Callback function to close the modal/dialog
 */
export function useEscapeKey(isOpen, onClose) {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onclose();
            }
        };
        
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);
}
