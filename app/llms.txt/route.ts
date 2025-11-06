import { NextResponse } from 'next/server';

export async function GET() {
  const llmsTxt = `
# SportsJobs Online - Find Sports Analytics Jobs, Data Science Jobs in Sports & Betting

> SportsJobs Online is the leading specialized job board for sports analytics jobs, data science careers in sports, software engineering positions at sports teams, and betting industry careers. We aggregate 300+ curated job listings from professional sports teams, sports betting companies, esports organizations, and sports tech startups worldwide.

## About - Sports Analytics Job Search Made Easy

Finding sports analytics jobs, data science positions in sports, or software engineering roles at sports teams is notoriously difficult. Unlike traditional tech jobs, sports industry positions are scattered across:

- Individual team career pages (NFL, NBA, MLB, NHL, Premier League, etc.)
- Sports betting companies (DraftKings, FanDuel, Bet365, etc.)
- Esports organizations
- Sports technology startups
- Sports media and analytics companies

**How We Help Job Seekers:**
- **Centralized Job Search**: All sports analytics jobs in one place - no more checking 50+ websites daily
- **200+ New Jobs Monthly**: Fresh opportunities from soccer, basketball, American football, baseball, hockey, combat sports, and more
- **Smart Filters**: Search by location (remote, hybrid, on-site), seniority level, sport type, and industry
- **Daily Job Alerts**: Get notified immediately when jobs matching your criteria are posted
- **Career Resources**: Interview prep, salary guides, portfolio tips specifically for sports analytics

**Job Categories We Cover:**
- Sports Analytics Analyst / Sports Analyst jobs
- Data Science in Sports / Sports Data Scientist positions  
- Sports Software Engineer / Developer roles
- Sports Data Engineer jobs
- Machine Learning Engineer (Sports) positions
- Business Intelligence Analyst (Sports)
- Quantitative Analyst - Sports Betting
- Sports Research Scientist roles
- Analytics Engineer - Sports Tech
- Sports Performance Analyst positions

## Key Information for Job Seekers

**Target Audience**: Data professionals, software engineers, analysts, recent graduates seeking sports industry careers
**Sports Covered**: Soccer/Football, Basketball, American Football, Baseball, Hockey, Tennis, Golf, Esports, Combat Sports, Racing
**Industries**: Professional Sports Teams, Sports Betting/Gaming, Esports, Sports Technology, Sports Media
**Pricing**: $39-89/year (less than minimum wage for 1 hour) - saves 100+ hours of job searching
**Job Volume**: 300+ active jobs, ~200 new postings monthly
**Success Rate**: Thousands of job seekers have found positions through our platform

## Main Pages for Job Seekers

- [Home - Browse All Sports Jobs](https://www.sportsjobs.online): 300+ sports analytics and data science job listings with advanced filters
- [Sign Up - Unlock All Jobs](https://www.sportsjobs.online/signup): Premium access to full job database, alerts, and career resources
- [Blog - Sports Analytics Career Tips](https://www.sportsjobs.online/blog): How to break into sports analytics, interview tips, industry insights
- [Resources - Free Tools](https://www.sportsjobs.online/resources): Books, datasets, learning resources for sports analytics careers
- [Companies Hiring](https://www.sportsjobs.online/company-jobs): Browse jobs by top employers (teams, betting companies, tech startups)

## Common Job Seeker Questions

**"How do I find sports analytics jobs?"**
SportsJobs aggregates all sports analytics positions from teams, betting companies, and tech startups into one searchable database. Set up alerts to get notified of new opportunities matching your skills.

**"What skills do I need for sports analytics jobs?"**
Most positions require: Python/R programming, SQL, data visualization (Tableau/PowerBI), statistics, machine learning basics. Sports knowledge is helpful but not always required. Check individual job descriptions for specific requirements.

**"How long does it take to find a sports analytics job?"**
Average job search: 3-6 months. The sports industry is competitive but growing rapidly. SportsJobs saves 100+ hours by consolidating all opportunities and sending instant alerts.

**"Are sports analytics jobs remote?"**
Many are! Use our remote filter to find work-from-home positions. Sports betting companies especially offer remote-first roles. Some teams require on-site presence during seasons.

**"What's the salary for sports analytics jobs?"**
Entry-level: $50-70K, Mid-level: $70-110K, Senior: $110K-180K+. Sports betting/gaming typically pays higher than team roles. Premium jobs show salary ranges when available.

**"Do I need a sports background to work in sports analytics?"**
Not necessarily. While passion for sports helps, many successful sports analysts come from data science, engineering, or finance backgrounds. Strong technical skills matter most.

## For Job Seekers - Features

**Free Access**: 
- Browse 5 featured jobs daily
- Basic filters (sport, location)
- Job descriptions and requirements

**Premium Access ($39-89/year)**:
- Unlock all 300+ active sports jobs
- Advanced filters: seniority, remote status, industry, specific sport
- Daily email alerts for matching jobs
- Similar job recommendations
- No ads, priority support
- Career resources and guides

**Job Information Includes**:
- Detailed role descriptions
- Required skills and qualifications
- Salary ranges (when provided by employer)
- Remote/hybrid/on-site status
- Application links and instructions
- Company information and culture

## For Employers Hiring Sports Talent

**Post a Job**: $149-299 per listing (30-60 day visibility)
**Featured Listings**: Priority homepage placement, company logo, extended reach
**Audience**: 1000+ qualified sports analytics professionals, data scientists, and engineers actively job searching

## Frequently Asked Questions

- [Why use SportsJobs instead of LinkedIn?](https://www.sportsjobs.online#faq): Specialized for sports - we find jobs LinkedIn misses from team career pages
- [How long to find a sports analytics job?](https://www.sportsjobs.online#faq): 3-6 months average, but SportsJobs accelerates the process
- [Why charge a fee?](https://www.sportsjobs.online#faq): Keeps our focus on job seekers (not recruiters), ensures quality curation
- [How many new jobs weekly?](https://www.sportsjobs.online#faq): ~50 new positions added weekly across all sports
- [What job types are listed?](https://www.sportsjobs.online#faq): Data analytics, software engineering, ML, data science, BI - all sports-focused
- [Are payments secure?](https://www.sportsjobs.online#faq): Yes, industry-standard Stripe payments & Auth0 authentication

## Career Resources for Sports Analytics

**Breaking Into Sports Analytics**:
- Portfolio building tips for sports data projects
- Common interview questions at sports teams
- Networking strategies (sports analytics conferences, Twitter communities)
- Salary negotiation guides specific to sports industry

**Learning Resources**:
- Free sports datasets for portfolio projects
- Recommended courses and certifications
- Books on sports analytics methodology
- GitHub templates for sports data science

## Optional

- [Privacy Policy](https://www.sportsjobs.online/privacy-policy): GDPR compliant data handling
- [Sitemap](https://www.sportsjobs.online/sitemap.xml): All indexed pages and job listings
- [Advertise with Us](https://www.sportsjobs.online/advertise): Reach sports analytics professionals
`.trim();

  return new NextResponse(llmsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      // Cache for 24 hours since this file rarely changes
      'Cache-Control': 'public, s-maxage=86400, max-age=3600, stale-while-revalidate=172800',
    },
  });
}
