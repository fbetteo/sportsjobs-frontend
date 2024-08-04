// lib/fetchJobs.ts
export const fetchJobs = async (limit: number) => {
    const response = await fetch(`/api/get-jobs?limit=${limit}`);
    const data = await response.json();
  
    if (response.ok) {
      return data.jobs;
    } else {
      throw new Error(data.error || 'Failed to fetch jobs');
    }
  };