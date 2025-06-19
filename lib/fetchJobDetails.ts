// lib/fetchJobDetails.ts
import { addMonths, isPast } from 'date-fns';
// import { decodeJobId } from '@/utils/jobIdEncoder';

export const fetchJobDetails = async (id: string) => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.sportsjobs.online' 
    : 'http://localhost:3000';
  
  try {
    // const decodedId = decodeJobId(encodedId);
    const response = await fetch(`${baseUrl}/api/get-job-details?id=${id}`);
    const data = await response.json();
    // console.log('Job details:', data);

    if (response.ok && data.job.id) {
      const job = data.job;
      const startDate = new Date(job.start_date);
      const validThrough = addMonths(startDate, 2); // Calculate validThrough (2 months)

      if (isPast(validThrough)) {
          return { job, expired: true }; // Job is expired
      }

      return { job, expired: false };
    }
    
    return null; // This will trigger notFound() for any error case
  } catch (error) {
    console.error('Error fetching job details:', error);
    return null; // Convert network/fetch errors to null as well
  }
};