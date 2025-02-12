// lib/fetchJobs.ts
const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.sportsjobs.online' 
    : 'http://localhost:3000';

export async function fetchJobsFeatured(limit: number) {
    try {
        const response = await fetch(`${baseUrl}/api/get-jobs-featured?limit=${limit}`);
        const data = await response.json();
        return data.jobs || []; // Ensure we always return an array
    } catch (error) {
        console.error('Error fetching featured jobs:', error);
        return []; // Return empty array on error
    }
}