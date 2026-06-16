import { generateMetadata } from './metadata';
import React, { ReactNode } from 'react';
export { generateMetadata };

export default function LocationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            {children}
        </div>
    );
}
