// This file exists only to handle incorrect links that Google has indexed
// It redirects requests from /job/[id] to the correct /jobs/[id] path
// This helps with SEO by eliminating 404 errors in Google Search Console

import { redirect } from 'next/navigation';

export default function JobRedirect({ params }: { params: { id: string } }) {
    // Redirect to the correct URL pattern
    redirect(`/jobs/${params.id}`);
}