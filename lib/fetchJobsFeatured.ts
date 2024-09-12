// lib/fetchJobs.ts
export const fetchJobsFeatured = async (limit: number) => {
    const params = new URLSearchParams({ limit: limit.toString()});
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://www.sportsjobs.online' 
      : 'http://localhost:3000';
      
    const response = await fetch(`${baseUrl}/api/get-jobs-featured?${params.toString()}`);
    const data = await response.json();
    
      if (response.ok) {
        return data.jobs;
      } else {
        throw new Error(data.error || 'Failed to fetch jobs');
      }
    };