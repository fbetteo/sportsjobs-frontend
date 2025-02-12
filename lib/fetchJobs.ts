// lib/fetchJobs.ts
const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.sportsjobs.online' 
    : 'http://localhost:3000';

export async function fetchJobs(limit: number, filters: string) {
    try {
        const filterObj = JSON.parse(filters);
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        
        Object.entries(filterObj).forEach(([key, value]) => {
            if (value) params.append(key, value.toString());
        });
        
        const response = await fetch(`${baseUrl}/api/get-jobs?${params.toString()}`, {
            next: {
                revalidate: 3600 // Cache for 1 hour
            }
        });
        
        const data = await response.json();
        return data.jobs || [];
    } catch (error) {
        console.error('Error in fetchJobs:', error);
        return [];
    }
}