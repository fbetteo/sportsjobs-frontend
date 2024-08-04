// import { useUser } from '@auth0/nextjs-auth0';
// import { useRouter } from 'next/navigation';
// import { ReactNode, useEffect } from 'react';

// interface WithAuthenticationProps {
//     children: ReactNode;
// }

// const WithAuthentication = ({ children }: WithAuthenticationProps) => {
//     const { user, error, isLoading } = useUser();
//     const router = useRouter();

//     useEffect(() => {
//         if (!isLoading && !user) {
//             router.push('/api/auth/login');
//         }
//     }, [isLoading, user, router]);

//     if (isLoading || !user) {
//         return <div>Loading...</div>;
//     }

//     return <>{children}</>;
// };

// export default WithAuthentication;
