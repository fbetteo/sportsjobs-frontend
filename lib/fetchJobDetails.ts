// lib/fetchJobDetails.ts
export const fetchJobDetails = async (id: string) => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.sportsjobs.online' 
    : 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/get-job-details?id=${id}`);
    const data = await response.json();
    // console.log('Job details:', data);

    if (response.ok && data.job.id) {
      return data.job;
    }
    
    return null; // This will trigger notFound() for any error case
  } catch (error) {
    return null; // Convert network/fetch errors to null as well
  }
};