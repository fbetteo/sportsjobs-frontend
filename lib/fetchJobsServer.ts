// lib/fetchJobsServer.ts
// Server-side job list fetches for ISR pages. These call the backend directly
// (lib/jobsBackend.ts) instead of the public /api routes, which cap anonymous
// requests and would add a self-fetch round trip.
import 'server-only';

import { fetchJobListFromBackend, JobListFilters } from './jobsBackend';

export async function fetchJobsServer(limit: number, filters: string = "{}", includeFullDetails: boolean = false) {
    try {
        const filterObj: JobListFilters = JSON.parse(filters) || {};
        return await fetchJobListFromBackend({
            limit,
            filters: filterObj,
            includeFullDetails,
            revalidateSeconds: 3600, // Scraper adds jobs about once a day
        });
    } catch (error) {
        console.error('Error in fetchJobsServer:', error);
        return [];
    }
}

export async function fetchJobsFeaturedServer(limit: number, includeFullDetails: boolean = false) {
    try {
        return await fetchJobListFromBackend({
            limit,
            featuredOnly: true,
            includeFullDetails,
            revalidateSeconds: 3600,
        });
    } catch (error) {
        console.error('Error in fetchJobsFeaturedServer:', error);
        return [];
    }
}
