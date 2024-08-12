// lib/fetchJobDetails.ts
export const fetchBlogPostDetails = async (id: string) => {

    const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.sportsjobs.online' 
    : 'http://localhost:3000';
    
      const response = await fetch(`${baseUrl}/api/get-blogpost-details?id=${id}`,  {
        cache: 'no-store', // Ensures the request is not cached
      });
    const data = await response.json();
    
      if (response.ok) {
        return data.blogpost;
      } else {
        throw new Error(data.error || 'Failed to fetch blogpost details');
      }
    };