// lib/fetchJobs.ts
export const fetchJobs = async (limit: number, filters: string) => {
  const params = new URLSearchParams({ limit: limit.toString()});
  const filtersObj = JSON.parse(filters);
  Object.keys(filtersObj).forEach(key => {
    params.append(key, filtersObj[key]);
  });
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.sportsjobs.online' 
    : 'http://localhost:3000';
    
  const response = await fetch(`${baseUrl}/api/get-jobs?${params.toString()}`);
  const data = await response.json();
  
    if (response.ok) {
      return data.jobs;
    } else {
      throw new Error(data.error || 'Failed to fetch jobs');
    }
  };