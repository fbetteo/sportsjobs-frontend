// lib/fetchJobs.ts
const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.sportsjobs.online' 
    : 'http://localhost:3000';

export async function fetchJobs(limit: number, filters: string) {
    try {
        const response = await fetch(`${baseUrl}/api/get-jobs?limit=${limit}&${new URLSearchParams(JSON.parse(filters))}`);
        const data = await response.json();
        return data.jobs || []; // Ensure we always return an array
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return []; // Return empty array on error
    }
}