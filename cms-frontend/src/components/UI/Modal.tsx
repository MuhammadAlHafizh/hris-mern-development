import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    disableBackdropClick?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md'
}) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    return (
        <div className="fixed inset-0 z-50">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                />

                <div className={`
            inline-block align-bottom bg-white rounded-lg text-left overflow-y-auto shadow-xl transform transition-all sm:my-8 sm:align-middle w-full ${sizeClasses[size]}
            `}>
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 min-h-fit">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium leading-6 text-black">
                                {title}
                            </h3>
                            <button
                                onClick={onClose}
                                className="rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none p-2"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
