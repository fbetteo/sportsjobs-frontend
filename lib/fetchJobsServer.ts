// lib/fetchJobsServer.ts
// Server-side fetch functions for ISR (no baseUrl needed, direct API calls)

export async function fetchJobsServer(limit: number, filters: string = "{}", includeFullDetails: boolean = false) {
    try {
        const filterObj = JSON.parse(filters);
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        
        if (includeFullDetails) {
            params.append('full', 'true');
        }
        
        Object.entries(filterObj).forEach(([key, value]) => {
            if (value) params.append(key, value.toString());
        });

        // Use absolute URL for server-side fetches
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sportsjobs.online';
        const response = await fetch(`${baseUrl}/api/get-jobs?${params.toString()}`, {
            next: { revalidate: 300 } // Cache for 5 minutes
        });
        
        if (!response.ok) {
            console.error('Server fetch failed:', response.status);
            return [];
        }
        
        const data = await response.json();
        return data.jobs || [];
    } catch (error) {
        console.error('Error in fetchJobsServer:', error);
        return [];
    }
}

export async function fetchJobsFeaturedServer(limit: number, includeFullDetails: boolean = false) {
    try {
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        
        if (includeFullDetails) {
            params.append('full', 'true');
        }
        
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sportsjobs.online';
        const response = await fetch(`${baseUrl}/api/get-jobs-featured?${params.toString()}`, {
            next: { revalidate: 600 } // Cache for 10 minutes (featured changes less)
        });
        
        if (!response.ok) {
            console.error('Server fetch featured failed:', response.status);
            return [];
        }
        
        const data = await response.json();
        return data.jobs || [];
    } catch (error) {
        console.error('Error in fetchJobsFeaturedServer:', error);
        return [];
    }
}
