import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import SettingsClient from './SettingsClient';

export default async function SettingsPage({
    searchParams,
}: {
    searchParams?: { signin?: string };
}) {
    const session = await getSession();

    if (!session?.user?.sub) {
        redirect('/api/auth/login?returnTo=%2Fsettings');
    }

    return <SettingsClient signInVerified={searchParams?.signin === 'verified'} />;
}
