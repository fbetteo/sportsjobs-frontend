// lib/fetchJobDetails.ts
export const fetchJobDetails = async (id: string) => {

  const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://www.sportsjobs.online' 
  : 'http://localhost:3000';
  
    const response = await fetch(`${baseUrl}/api/get-job-details?id=${id}`);
    const data = await response.json();
  
    if (response.ok) {
      return data.job;
    } else {
      throw new Error(data.error || 'Failed to fetch jobs');
    }
  };