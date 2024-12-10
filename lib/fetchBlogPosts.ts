// lib/fetchJobs.ts
const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.sportsjobs.online' 
    : 'http://localhost:3000';

export async function fetchBlogPosts(limit: number, filters: string) {
    try {
        const filterObj = JSON.parse(filters);
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        
        // Add filters to params
        Object.entries(filterObj).forEach(([key, value]) => {
            if (value) params.append(key, value.toString());
        });

        const response = await fetch(`${baseUrl}/api/get-blogposts?${params.toString()}`, {
            cache: 'no-store',
            next: { revalidate: 0 }
        });
        
        const data = await response.json();
        return data.blogposts || [];
    } catch (error) {
        console.error('Error in fetchBlogPosts:', error);
        return [];
    }
}