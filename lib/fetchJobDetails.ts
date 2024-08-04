// lib/fetchJobDetails.ts
export const fetchJobDetails = async (id: string) => {
    const response = await fetch(`/api/get-job-details?id=${id}`);
    const data = await response.json();
  
    if (response.ok) {
      return data.job;
    } else {
      throw new Error(data.error || 'Failed to fetch jobs');
    }
  };