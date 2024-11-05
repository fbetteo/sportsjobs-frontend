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

export async function updateAirtableRecord(email: string, fields: { [key: string]: any }) {
  try {
    const records = await base('users').select({
        filterByFormula: `{email} = '${email}'`,
    }).firstPage();

    if (records.length === 0) {
        throw new Error('Record not found');
    }

    const recordId = records[0].id;
    console.log('Updating record:', recordId);

    await base('users').update(recordId, fields);
  } catch (error) {
    console.error('Error updating Airtable record:', error);
    throw error;
  }
}
