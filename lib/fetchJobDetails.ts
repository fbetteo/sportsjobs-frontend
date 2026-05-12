// lib/fetchJobDetails.ts
import { addMonths, isPast } from 'date-fns';
import { fetchJobDetailsFromBackend } from './jobDetailsBackend';
// import { decodeJobId } from '@/utils/jobIdEncoder';

export const fetchJobDetails = async (id: string) => {
  try {
    // const decodedId = decodeJobId(encodedId);
    const job = await fetchJobDetailsFromBackend(id);

    if (!job?.id) {
      return null;
    }

    const startDate = new Date(job.start_date);
    const validThrough = addMonths(startDate, 2); // Calculate validThrough (2 months)

    if (isPast(validThrough)) {
      return { job, expired: true }; // Job is expired
    }

    return { job, expired: false };
  } catch (error) {
    console.error('Error fetching job details:', error);
    return null; // Convert network/fetch errors to null as well
  }
};
