// lib/fetchCompanies.ts
const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.sportsjobs.online' 
    : 'http://localhost:3000';

export async function fetchCompanies() {
    try {
        const response = await fetch(`${baseUrl}/api/get-companies`);
        const data = await response.json();
        return data.companies;
    } catch (error) {
        console.error('Error fetching companies:', error);
        return null; // Convert network/fetch errors to null as well
      }
  }