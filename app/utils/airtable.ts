// utils/airtable.ts

import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(process.env.AIRTABLE_BASE!);

export async function createAirtableRecord(name: string, email: string, plan: string) {
  try {
    const record = await base('users').create({
      //   fields: {
        Name: name,
        email: email,
        plan: plan
    //   }
    });
    return record;
  } catch (error) {
    console.error('Error creating Airtable record:', error);
    throw error;
  }
}
