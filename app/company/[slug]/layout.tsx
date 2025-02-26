import { generateMetadata } from './metadata';

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
