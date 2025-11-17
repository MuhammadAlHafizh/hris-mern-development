import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: 'sm' | 'md' | 'lg';
    onClick?: () => void
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    padding = 'md',
    onClick
}) => {
    const paddingClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    return (
        <div className={`
            bg-white rounded-lg shadow-sm border border-gray-200
            ${paddingClasses[padding]} ${className}
        `}
        onClick={onClick}
        >
            {children}
        </div>
    );
};
