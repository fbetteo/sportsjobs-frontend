// pages/api/dropdown-options.ts
import { NextResponse } from 'next/server';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN ?? '' }).base(process.env.AIRTABLE_BASE ?? '');


const fetchDropdownOptions = async () => {
    try {
    //   const records = await base('jobs').select().all();
  
    //   const uniqueValues = (field: string) => {
    //     const values = new Set();
    //     records.forEach(record => {
    //       const value = record.get(field);
    //       if (value) {
    //         values.add(value);
    //       }
    //     });
    //     return Array.from(values);
    //   };
  
    //   const countries = uniqueValues('country');
    //   const seniorities = uniqueValues('seniority');
    //     const remotes = uniqueValues('remote');
    //     const hours = uniqueValues('hours');
    //     const skills = uniqueValues('skills');
    //     const sport_list = uniqueValues('sport_list');

        const countries = ['united states', 'greece', 'india', 'germany', 'united kingdom', 'spain', 'denmark', 'czechia', 'poland', 'serbia', 'cyprus', 'lithuania', 'canada', 'switzerland', 'malta', 'hungary', 'france', 'colombia', 'belgium', 'philippines']
        const seniorities = ['Internship', 'Junior', 'With Experience']; // Add your seniority levels here
        const remotes = ['Office', 'Remote', 'Global Remote']; // Add your remote options here
        const hours = ['Fulltime', 'Part time']; // Add your hours options here
        const sport_list = ['Golf', 'Football - NFL', 'Football - Soccer', 'Basketball', 'Baseball', 'Tennis', 'Hockey', 'Formula 1']; // Add your sports options here
        const skills =[
            "Manager", "Sports", "SQL", "Statistics", "Excel", "Data", "IT", "Analytics", "Salesforce",
            "Python", "Data Science", "Tableau", "AWS", "Swift", "Media", "Google Analytics", "Postgres", 
            "Redshift", "R", "Powerpoint", "Power BI", "Devops", "Machine Learning", "Networks", "Docker", 
            "Kafka", "GCP", "Azure", "Gaming", "Kubernetes", "AI", "ETL", "Business Intelligence", 
            "BigQuery", "DBT", "ELT", "Git", "A/B testing", "HTML", "Javascript", "React", "IOS", 
            "TypeScript", "baseball", "Redis", "MLOps"
        ]; 
        const industries = ['Sports', 'Betting', 'Esports']
        const job_area = ['DS/ML/AI', 'Analytics', 'Data Engineer']
  
      return { countries, seniorities, remotes, hours, skills, sport_list, industries, job_area };
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
      return { countries: [], seniorities: [], remotes: [], hours: [], skills: [], sport_list: [], industries: [], job_area: [] };
    }
  };
  
  export async function GET() {
    const options = await fetchDropdownOptions();
    return NextResponse.json(options);
  }
