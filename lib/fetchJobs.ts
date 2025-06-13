// lib/fetchJobs.ts
const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.sportsjobs.online' 
    : 'http://localhost:3000';

export async function fetchJobs(limit: number, filters: string) {
    try {
        // Parse filters and create URLSearchParams
        const filterObj = JSON.parse(filters);
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        
        // Handle filters separately to ensure proper encoding
        Object.entries(filterObj).forEach(([key, value]) => {
            if (value) params.append(key, value.toString());
        });

        console.log('Fetch URL params:', params.toString()); // Debug log
        
        const response = await fetch(`${baseUrl}/api/get-jobs?${params.toString()}`);
        const data = await response.json();
        // console.log('API Response:', data); // Debug log
        return data.jobs || [];
    } catch (error) {
        console.error('Error in fetchJobs:', error);
        return [];
    }
}