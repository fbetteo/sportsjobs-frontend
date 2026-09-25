export interface LandingPageJob {
  id: string;
  title?: string;
  company?: string;
  salary?: string;
  location?: string;
  country?: string;
  seniority?: string;
  remote_string?: string;
  days_ago_text?: string;
  logo_permanent_url?: string;
  sport_list?: string;
  job_area?: string;
}

export interface JobLandingPageConfig {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  keywords: string[];
  badge: string;
  intro: string;
  jobsHeading: string;
  emptyMessage: string;
  filters?: Record<string, string>;
  matchAny?: string[];
  roleGroups: Array<{ title: string; text: string }>;
  skills: string[];
  searchAdvice: string;
  faqs: Array<{ question: string; answer: string }>;
  relatedSlugs: string[];
}

const configs: JobLandingPageConfig[] = [
  {
    slug: 'nhl-jobs',
    title: 'NHL Jobs and Hockey Careers',
    shortTitle: 'NHL Jobs',
    description: 'Find current NHL jobs and hockey careers in analytics, operations, marketing, technology, scouting, and team business departments.',
    keywords: ['NHL jobs', 'NHL careers', 'NHL job openings', 'hockey jobs', 'NHL analytics jobs'],
    badge: 'NHL and professional hockey careers',
    intro: 'Browse current opportunities across NHL clubs, league partners, hockey technology companies, and adjacent professional hockey organizations. Openings can span the front office, hockey operations, data and video, business intelligence, marketing, and venue operations.',
    jobsHeading: 'Latest NHL and Hockey Jobs',
    emptyMessage: 'No matching NHL or professional hockey openings are visible right now. New roles are added regularly, so check back soon.',
    filters: { sport: 'Hockey' },
    roleGroups: [
      { title: 'Hockey Operations and Analytics', text: 'Player evaluation, scouting, video, research and development, salary-cap analysis, and performance reporting roles support roster and game decisions.' },
      { title: 'Business and Fan Analytics', text: 'Teams hire analysts for ticketing, CRM, sponsorship, finance, pricing, and fan engagement work away from the ice.' },
      { title: 'Technology and Data', text: 'Data engineering, software, tracking systems, and business intelligence roles maintain the tools used by both hockey and commercial departments.' },
      { title: 'Marketing and Team Operations', text: 'Communications, content, partnerships, events, and arena operations provide additional paths into NHL organizations.' },
    ],
    skills: ['SQL, Python, R, Excel, Tableau, and Power BI', 'Hockey knowledge and clear communication with nontechnical staff', 'Video, event, tracking, ticketing, or CRM data experience', 'A portfolio that answers a real hockey or sports-business question'],
    searchAdvice: 'Search beyond the phrase “NHL jobs.” Clubs frequently use department-specific titles such as hockey operations assistant, quantitative analyst, business intelligence analyst, partnership insights, or video coordinator. Vendors and league partners can offer similar work without naming the NHL in the title.',
    faqs: [
      { question: 'What kinds of jobs are available in the NHL?', answer: 'NHL organizations hire across hockey operations, scouting, analytics, software, finance, ticketing, sponsorships, marketing, communications, events, and arena operations.' },
      { question: 'Do NHL jobs require professional hockey experience?', answer: 'Not always. Technical and business roles often prioritize relevant analytical, software, finance, marketing, or operations experience. Hockey context helps when the work directly supports players or coaches.' },
      { question: 'Where are NHL jobs posted?', answer: 'Openings may appear on individual club career sites, league and venue sites, partner organizations, and specialist sports job boards. This page consolidates relevant roles found by SportsJobs Online.' },
    ],
    relatedSlugs: ['nhl-internships', 'remote-sports-jobs', 'sports-data-analyst-jobs'],
  },
  {
    slug: 'nhl-internships',
    title: 'NHL Internships and Hockey Internships',
    shortTitle: 'NHL Internships',
    description: 'Find current NHL internships and hockey internships, including summer roles in analytics, operations, marketing, media, and team business.',
    keywords: ['NHL internships', 'NHL summer internships', 'NHL internships 2026', 'hockey internships'],
    badge: 'Student and early-career hockey roles',
    intro: 'Explore internships with NHL clubs and the wider professional hockey ecosystem. Programs vary by team and season, but commonly cover hockey operations, analytics, community relations, content, partnerships, ticketing, and event support.',
    jobsHeading: 'Latest NHL and Hockey Internships',
    emptyMessage: 'No matching hockey internships are visible right now. NHL internship recruiting is seasonal, so check again as summer and season-based programs open.',
    filters: { sport: 'Hockey', seniority: 'Internship' },
    roleGroups: [
      { title: 'Hockey Operations', text: 'Interns may support video, scouting, player development, equipment, team services, or structured hockey research.' },
      { title: 'Analytics and Reporting', text: 'Data-oriented programs can include game analysis, dashboards, data quality, business intelligence, and research projects.' },
      { title: 'Marketing and Community', text: 'Content, social, communications, community relations, and partnership activation internships are common entry points.' },
      { title: 'Ticketing and Events', text: 'Sales, service, arena events, and fan-experience roles teach the commercial side of operating a professional club.' },
    ],
    skills: ['Excel and concise presentation skills', 'SQL, Python, R, or visualization tools for analytics roles', 'Evidence of hockey knowledge through projects or team experience', 'Availability that matches the club’s season and in-person requirements'],
    searchAdvice: 'Summer programs often open months before their start date, while season-long internships follow the hockey calendar. Set alerts early and search both “internship” and entry-level titles such as seasonal assistant, fellow, associate, or coordinator.',
    faqs: [
      { question: 'When do NHL summer internships open?', answer: 'Timing differs by club, but many summer programs appear from late fall through early spring. Season-based roles may follow the NHL calendar instead.' },
      { question: 'Are NHL internships paid?', answer: 'Compensation varies by organization and location. Read each posting carefully for hourly pay, academic-credit requirements, relocation, and schedule expectations.' },
      { question: 'Can students get NHL analytics internships?', answer: 'Yes. Strong candidates usually combine statistics or programming skills with a focused hockey project and the ability to explain results clearly.' },
    ],
    relatedSlugs: ['nhl-jobs', 'sports-analytics-internships', 'sports-data-analyst-jobs'],
  },
  {
    slug: 'sports-data-analyst-jobs',
    title: 'Sports Data Analyst Jobs',
    shortTitle: 'Sports Data Analyst Jobs',
    description: 'Find sports data analyst jobs in performance, business intelligence, fan analytics, betting, media, and sports technology.',
    keywords: ['sports data analyst jobs', 'sports analyst jobs', 'sports data jobs', 'sports data science jobs'],
    badge: 'Analytics and data careers in sports',
    intro: 'Find roles that turn player, game, fan, commercial, media, or betting data into decisions. Sports data analysts work for teams and leagues, but also for technology vendors, media companies, sportsbooks, agencies, and research organizations.',
    jobsHeading: 'Latest Sports Data Analyst Jobs',
    emptyMessage: 'No closely matching analyst openings are visible right now. Browse the main job board for adjacent data science, business intelligence, and engineering roles.',
    matchAny: ['data analyst', 'analytics analyst', 'sports analyst', 'business intelligence', 'data scientist', 'quantitative analyst', 'insights analyst', 'analytics'],
    roleGroups: [
      { title: 'Performance Analytics', text: 'Analysts support coaching, scouting, player development, medical, and performance teams with game and athlete data.' },
      { title: 'Business Intelligence', text: 'Commercial analysts work on ticketing, pricing, CRM, sponsorships, finance, and fan behavior.' },
      { title: 'Betting and Media Data', text: 'Sportsbooks, data providers, and media companies hire analysts for modeling, trading, content, integrity, and audience products.' },
      { title: 'Data Science and Engineering', text: 'More technical roles build models, pipelines, metrics, APIs, and internal tools that analysts and decision-makers use.' },
    ],
    skills: ['SQL and spreadsheet analysis', 'Python or R for reproducible analysis', 'Tableau, Power BI, Looker, or another visualization tool', 'Statistics, experimentation, and communication with stakeholders'],
    searchAdvice: 'Do not search only for “sports data analyst.” Relevant openings may be titled business intelligence analyst, strategy analyst, performance analyst, research analyst, data scientist, quantitative analyst, or insights analyst.',
    faqs: [
      { question: 'What does a sports data analyst do?', answer: 'The role turns sports or sports-business data into reports, models, dashboards, and recommendations. The exact work depends on whether the employer focuses on performance, fans, revenue, media, or betting.' },
      { question: 'What skills do sports data analyst jobs require?', answer: 'SQL, Excel, visualization, statistics, and clear communication are common. Python or R is frequently requested for more technical and performance-focused roles.' },
      { question: 'Do I need a sports degree?', answer: 'Usually not. Employers commonly hire candidates from statistics, data science, economics, computer science, engineering, finance, and business backgrounds.' },
    ],
    relatedSlugs: ['sports-analytics-internships', 'remote-sports-jobs', 'sports-science-jobs'],
  },
  {
    slug: 'wnba-jobs',
    title: 'WNBA Jobs, Careers, and Internships',
    shortTitle: 'WNBA Jobs',
    description: 'Find current WNBA jobs, careers, and internships with teams, league partners, basketball companies, and sports organizations.',
    keywords: ['WNBA jobs', 'WNBA careers', 'WNBA internships', 'WNBA job openings'],
    badge: 'Women’s professional basketball careers',
    intro: 'Explore jobs connected to the WNBA and women’s professional basketball, from team analytics and basketball operations to ticketing, partnerships, marketing, media, and league growth.',
    jobsHeading: 'Latest WNBA and Women’s Basketball Jobs',
    emptyMessage: 'No closely matching WNBA openings are visible right now. Check back as teams and league partners add seasonal and full-time roles.',
    filters: { sport: 'Basketball' },
    matchAny: ['wnba', 'atlanta dream', 'chicago sky', 'connecticut sun', 'dallas wings', 'golden state valkyries', 'indiana fever', 'las vegas aces', 'los angeles sparks', 'minnesota lynx', 'new york liberty', 'phoenix mercury', 'seattle storm', 'washington mystics'],
    roleGroups: [
      { title: 'Basketball Operations', text: 'Scouting, video, analytics, team operations, and player-development roles support on-court decisions.' },
      { title: 'League and Team Business', text: 'Ticketing, partnerships, finance, strategy, and fan analytics support sustainable team growth.' },
      { title: 'Marketing and Media', text: 'Content, communications, social media, brand, and production teams help grow the league’s audience.' },
      { title: 'Internships and Seasonal Work', text: 'Teams frequently use internships, game-night positions, and seasonal roles as early-career entry points.' },
    ],
    skills: ['Basketball knowledge appropriate to the department', 'Analytics, CRM, marketing, content, or operations experience', 'Clear writing and cross-functional communication', 'Flexibility for games, events, and seasonal schedules'],
    searchAdvice: 'Search the league, each club, arena operators, ownership groups, and commercial partners. A role supporting a WNBA team may be listed under its parent company rather than the team name.',
    faqs: [
      { question: 'What jobs are available in the WNBA?', answer: 'WNBA employers hire in basketball operations, analytics, ticketing, partnerships, marketing, communications, finance, community relations, and event operations.' },
      { question: 'Does the WNBA offer internships?', answer: 'Teams, league offices, and related organizations offer internships and seasonal roles, although timing and departments differ each year.' },
      { question: 'Where should I look for WNBA careers?', answer: 'Check team and league sites, ownership groups, venues, partners, and specialist sports job boards. Searching individual department names often finds more than a generic WNBA search.' },
    ],
    relatedSlugs: ['nba-internships', 'sports-analytics-internships', 'sports-marketing-jobs'],
  },
  {
    slug: 'remote-sports-jobs',
    title: 'Remote Sports Jobs',
    shortTitle: 'Remote Sports Jobs',
    description: 'Find remote sports jobs in analytics, data, software, marketing, media, betting, and business operations.',
    keywords: ['remote sports jobs', 'sports analytics jobs remote', 'remote hockey jobs', 'remote soccer jobs'],
    badge: 'Work-from-home sports careers',
    intro: 'Browse sports roles advertised as remote. Remote work is most common in software, data, betting, media, marketing, sales, and business analytics; team-performance roles are more likely to require access to athletes and facilities.',
    jobsHeading: 'Latest Remote Sports Jobs',
    emptyMessage: 'No roles explicitly marked remote are visible right now. Hybrid and location-flexible openings may still be available on the main job board.',
    filters: { remote: 'Remote' },
    roleGroups: [
      { title: 'Data and Software', text: 'Engineering, data science, analytics, product, and technical-support teams are often able to work across locations.' },
      { title: 'Betting and Trading', text: 'Sportsbooks and data companies may hire remote traders, quantitative analysts, risk staff, and operations specialists.' },
      { title: 'Marketing and Content', text: 'Distributed media, social, editorial, design, and growth teams frequently recruit beyond one city.' },
      { title: 'Sales and Customer Success', text: 'Sports technology vendors often support clubs and organizations through remote commercial and implementation roles.' },
    ],
    skills: ['Independent written communication', 'Comfort with distributed tools and asynchronous work', 'Role-specific analytics, engineering, marketing, or sales experience', 'Awareness of country, state, and time-zone restrictions'],
    searchAdvice: '“Remote” does not always mean work from anywhere. Check the eligible country or state, required working hours, travel expectations, and whether the employer can hire in your location before applying.',
    faqs: [
      { question: 'What sports jobs can be done remotely?', answer: 'Software, data, analytics, betting, content, design, marketing, sales, and customer-success roles are the most common. Coaching and athlete-facing performance roles are less frequently remote.' },
      { question: 'Are remote sports jobs location-independent?', answer: 'Not necessarily. Employers may restrict hiring because of payroll, tax, licensing, time-zone, or occasional travel requirements.' },
      { question: 'How can I stand out for a remote sports role?', answer: 'Show relevant work samples and demonstrate clear written communication, independent delivery, and experience collaborating across teams or time zones.' },
    ],
    relatedSlugs: ['sports-data-analyst-jobs', 'sports-marketing-jobs', 'baseball-analytics-jobs'],
  },
  {
    slug: 'football-data-analyst-jobs',
    title: 'Football Data Analyst and Analytics Jobs',
    shortTitle: 'Football Data Jobs',
    description: 'Find football data analyst jobs in soccer and American football, including performance, scouting, operations, and analytics roles.',
    keywords: ['football data analyst jobs', 'football analyst jobs', 'football analytics jobs', 'football operations jobs'],
    badge: 'Data and performance careers in football',
    intro: 'Browse data, analysis, performance, scouting, and operations opportunities across association football and American football. Because “football” means different sports by market, every listing should be checked for the competition and discipline it supports.',
    jobsHeading: 'Latest Football Data and Analytics Jobs',
    emptyMessage: 'No closely matching football analytics roles are visible right now. Check back as clubs, leagues, and data providers add openings.',
    matchAny: ['football analyst', 'football analytics', 'football data', 'soccer analyst', 'soccer analytics', 'performance analyst', 'football operations', 'scouting analyst'],
    roleGroups: [
      { title: 'Performance Analysis', text: 'Analysts combine video, event, and tracking data to support match preparation, player development, and coaching.' },
      { title: 'Recruitment and Scouting', text: 'Data scouting teams evaluate players, leagues, fit, and value alongside traditional observation.' },
      { title: 'Football Operations', text: 'Operations analysts support roster processes, planning, scheduling, compliance, and front-office decisions.' },
      { title: 'Data Providers and Media', text: 'Vendors build football datasets, models, products, broadcasts, and editorial analysis for external customers.' },
    ],
    skills: ['SQL, Python, R, or football analysis platforms', 'Video, event, tracking, or physical-performance data', 'Tactical understanding and concise presentation', 'A portfolio built around a clearly framed football question'],
    searchAdvice: 'Use both “football” and “soccer” when searching internationally. Also try performance analyst, recruitment analyst, opposition analyst, scouting analyst, quantitative analyst, and football operations titles.',
    faqs: [
      { question: 'What does a football data analyst do?', answer: 'Football analysts use video and data to support coaching, recruitment, player development, operations, media, or commercial decisions.' },
      { question: 'Which tools are useful for football analytics jobs?', answer: 'SQL, Python or R, visualization tools, spreadsheets, and domain-specific video or event-data platforms are common. Requirements vary substantially by role.' },
      { question: 'Can a personal football analytics project help?', answer: 'Yes. A focused project that explains its question, data limitations, method, and practical conclusion is strong evidence of both technical and communication skills.' },
    ],
    relatedSlugs: ['mls-internships', 'sports-data-analyst-jobs', 'sports-science-jobs'],
  },
  {
    slug: 'mls-internships',
    title: 'MLS Internships and Soccer Internships',
    shortTitle: 'MLS Internships',
    description: 'Find current MLS internships and soccer internships in analytics, team operations, marketing, partnerships, media, and community relations.',
    keywords: ['MLS internships', 'MLS summer internships', 'MLS internship', 'soccer internships'],
    badge: 'Student roles in Major League Soccer',
    intro: 'Explore internships with MLS clubs, the league, soccer venues, and related organizations. Programs may cover sporting operations and analytics or the commercial departments that run matches, partnerships, ticketing, media, and community work.',
    jobsHeading: 'Latest MLS and Soccer Internships',
    emptyMessage: 'No closely matching MLS internships are visible right now. Recruiting is seasonal, so check back as clubs publish summer and season-based programs.',
    filters: { sport: 'Football - Soccer', seniority: 'Internship' },
    matchAny: ['mls', 'major league soccer'],
    roleGroups: [
      { title: 'Sporting and Performance', text: 'Analytics, video, scouting, academy, and team-operations internships support soccer decision-making.' },
      { title: 'Business Intelligence', text: 'Clubs use interns for ticketing, CRM, finance, sponsorship measurement, and fan reporting.' },
      { title: 'Marketing and Content', text: 'Social, communications, production, design, and brand internships support club storytelling and audience growth.' },
      { title: 'Community and Events', text: 'Community impact, match-day, partnership activation, and venue internships provide operational experience.' },
    ],
    skills: ['Strong organization and communication', 'Excel and reporting for most business roles', 'SQL, Python, R, video, or visualization for technical roles', 'Availability for match days and the stated internship period'],
    searchAdvice: 'Search individual clubs as well as MLS itself. Club internships may be posted under an ownership group, stadium, affiliated academy, or shared services organization.',
    faqs: [
      { question: 'When do MLS summer internships open?', answer: 'Many summer programs recruit during winter and early spring, but each club sets its own calendar and some opportunities follow the playing season.' },
      { question: 'Are MLS internships only for soccer analytics?', answer: 'No. Clubs recruit interns across partnerships, ticketing, marketing, communications, community relations, finance, events, and sporting operations.' },
      { question: 'Do MLS internships require soccer experience?', answer: 'Soccer knowledge can help, especially in sporting roles, but business and technical departments often prioritize the relevant functional skills.' },
    ],
    relatedSlugs: ['football-data-analyst-jobs', 'sports-analytics-internships', 'sports-marketing-jobs'],
  },
  {
    slug: 'baseball-analytics-jobs',
    title: 'Baseball Analytics and Operations Jobs',
    shortTitle: 'Baseball Analytics Jobs',
    description: 'Find baseball analytics jobs in research and development, operations, scouting, player development, data science, and software.',
    keywords: ['baseball analytics jobs', 'baseball operations jobs', 'baseball scouting jobs', 'baseball data jobs'],
    badge: 'Analytics and operations careers in baseball',
    intro: 'Browse opportunities across professional baseball, college programs, data providers, and baseball technology. The field includes quantitative research and software as well as scouting, video, player development, and front-office operations.',
    jobsHeading: 'Latest Baseball Analytics and Operations Jobs',
    emptyMessage: 'No matching baseball openings are visible right now. Baseball hiring is seasonal, so check back as clubs add roles around the offseason and upcoming season.',
    filters: { sport: 'Baseball' },
    roleGroups: [
      { title: 'Research and Development', text: 'Quantitative analysts and data scientists build player-evaluation, strategy, projection, and decision-support models.' },
      { title: 'Baseball Operations', text: 'Operations roles support rosters, contracts, rules, scheduling, advance preparation, and front-office workflows.' },
      { title: 'Scouting and Player Development', text: 'Analysts combine observations, video, biomechanics, tracking, and performance data to evaluate and develop players.' },
      { title: 'Software and Data Engineering', text: 'Engineers build the data pipelines, internal applications, databases, and video systems used throughout the organization.' },
    ],
    skills: ['SQL, Python or R, statistics, and reproducible analysis', 'Baseball rules, metrics, and decision context', 'Tracking, biomechanics, scouting, or video familiarity', 'Ability to communicate findings to coaches, scouts, and executives'],
    searchAdvice: 'Look beyond “baseball analytics.” Teams use titles such as analyst, associate, fellow, developer, research scientist, baseball systems engineer, advance scouting, and player-development coordinator.',
    faqs: [
      { question: 'What jobs are available in baseball analytics?', answer: 'Common areas include quantitative analysis, research and development, data science, software, scouting, player development, biomechanics, and baseball operations.' },
      { question: 'Is coding required for baseball analytics jobs?', answer: 'Many quantitative roles expect SQL plus Python or R. Operations, scouting, and video roles may require less coding but still value strong analytical reasoning.' },
      { question: 'When do baseball teams hire?', answer: 'Hiring occurs year-round, but many seasonal, associate, and internship roles are posted during the offseason before the next playing season.' },
    ],
    relatedSlugs: ['sports-data-analyst-jobs', 'sports-science-jobs', 'remote-sports-jobs'],
  },
  {
    slug: 'sports-science-jobs',
    title: 'Sports Science and Biomechanics Jobs',
    shortTitle: 'Sports Science Jobs',
    description: 'Find sports science, sport scientist, biomechanics, human performance, and athlete monitoring jobs.',
    keywords: ['sports science jobs', 'sport scientist jobs', 'biomechanics jobs', 'sports biomechanics jobs'],
    badge: 'Human performance careers in sport',
    intro: 'Find roles focused on athlete health, training, movement, recovery, and performance. Sports science sits between coaching, medicine, strength and conditioning, biomechanics, physiology, and data analysis.',
    jobsHeading: 'Latest Sports Science and Biomechanics Jobs',
    emptyMessage: 'No closely matching sports science roles are visible right now. Browse the main board for adjacent performance, medical, and analytics openings.',
    matchAny: ['sport scientist', 'sports scientist', 'sports science', 'sport science', 'biomechan', 'human performance', 'performance science', 'sports performance', 'athlete monitoring', 'exercise physiolog'],
    roleGroups: [
      { title: 'Performance Science', text: 'Practitioners help plan training, monitor workload, evaluate readiness, and translate evidence into coaching decisions.' },
      { title: 'Biomechanics', text: 'Biomechanists study movement using force, motion, video, sensor, and laboratory data to support performance and injury reduction.' },
      { title: 'Physiology and Recovery', text: 'Roles may cover conditioning, testing, sleep, nutrition, recovery, environmental stress, and return-to-play support.' },
      { title: 'Performance Data', text: 'Analysts and engineers maintain athlete-management systems, dashboards, wearable data, and repeatable monitoring workflows.' },
    ],
    skills: ['Exercise science, biomechanics, physiology, or a related discipline', 'Statistics and careful measurement design', 'Athlete monitoring, force plates, motion capture, GPS, or wearable systems', 'Communication within multidisciplinary performance and medical teams'],
    searchAdvice: 'Relevant titles vary widely. Search for sport scientist, performance scientist, biomechanist, human performance, athlete monitoring, strength and conditioning, research scientist, and performance data analyst.',
    faqs: [
      { question: 'What does a sports scientist do?', answer: 'Sports scientists measure and interpret athlete training, movement, readiness, and recovery so coaches and performance staff can make better decisions.' },
      { question: 'What education do sports science jobs require?', answer: 'Many roles request a degree in exercise science, kinesiology, biomechanics, physiology, statistics, or a related field. Research-heavy roles may require postgraduate study.' },
      { question: 'Is data analysis important in sports science?', answer: 'Yes. Even applied roles require reliable data collection, basic statistics, visualization, and the ability to distinguish meaningful change from normal variation.' },
    ],
    relatedSlugs: ['sports-data-analyst-jobs', 'baseball-analytics-jobs', 'football-data-analyst-jobs'],
  },
  {
    slug: 'sports-marketing-jobs',
    title: 'Sports Marketing and Media Jobs',
    shortTitle: 'Sports Marketing Jobs',
    description: 'Find sports marketing jobs and internships in digital marketing, partnerships, social media, content, communications, and fan engagement.',
    keywords: ['sports marketing jobs', 'sports marketing internships', 'sports media internships', 'remote sports marketing jobs'],
    badge: 'Marketing, media, and fan-growth careers',
    intro: 'Browse marketing and media opportunities with teams, leagues, agencies, brands, venues, publishers, and sports technology companies. Roles range from creative production and communications to measurable growth, CRM, partnerships, and audience analytics.',
    jobsHeading: 'Latest Sports Marketing and Media Jobs',
    emptyMessage: 'No closely matching sports marketing roles are visible right now. Check the main board for adjacent content, partnerships, and business openings.',
    matchAny: ['marketing', 'social media', 'content ', 'communications', 'partnership', 'sponsorship', 'brand ', 'creative', 'photograph', 'video producer', 'media '],
    roleGroups: [
      { title: 'Digital and Growth Marketing', text: 'Campaign, email, paid media, SEO, conversion, and lifecycle roles connect audience growth with measurable outcomes.' },
      { title: 'Content and Social Media', text: 'Editorial, video, design, photography, and social teams publish around games, athletes, fans, and brand moments.' },
      { title: 'Partnerships and Sponsorships', text: 'Commercial teams sell, activate, and measure relationships between sports properties and partner brands.' },
      { title: 'Fan and CRM Analytics', text: 'Analysts segment audiences, evaluate campaigns, improve retention, and support ticketing and membership programs.' },
    ],
    skills: ['Campaign planning and performance measurement', 'Clear writing, storytelling, and brand judgment', 'CRM, email, social, web, or analytics tools', 'A portfolio with outcomes, not only finished creative work'],
    searchAdvice: 'Sports marketing work may sit under growth, fan engagement, partnerships, communications, content, brand, ticketing, or business intelligence. Search those department names as well as “marketing.”',
    faqs: [
      { question: 'What jobs are available in sports marketing?', answer: 'Common areas include digital marketing, social media, content, communications, brand, sponsorships, partnerships, CRM, ticketing, and fan engagement.' },
      { question: 'Do sports marketing jobs require a marketing degree?', answer: 'Not always. Employers also value communications, business, analytics, design, journalism, sales, and demonstrable campaign or audience experience.' },
      { question: 'Can sports marketing jobs be remote?', answer: 'Some digital, content, agency, and technology roles are remote. Team and event roles more often require onsite work around games, athletes, sponsors, and venues.' },
    ],
    relatedSlugs: ['remote-sports-jobs', 'wnba-jobs', 'sports-data-analyst-jobs'],
  },
  {
    slug: 'nfl-internships',
    title: 'NFL Internships and Training Camp Internships',
    shortTitle: 'NFL Internships',
    description: 'Find current NFL internships, including training camp, analytics, football operations, marketing, media, and team business roles.',
    keywords: ['NFL internships', 'NFL training camp internships', 'NFL summer internships', 'football internships'],
    badge: 'Student and seasonal roles in professional football',
    intro: 'Explore internships with NFL clubs and related professional football organizations. Opportunities may support football operations and analytics or business departments such as marketing, communications, partnerships, ticketing, finance, and events.',
    jobsHeading: 'Latest NFL and Professional Football Internships',
    emptyMessage: 'No matching NFL internships are visible right now. Training camp and summer recruiting are seasonal, so check back as teams open their programs.',
    filters: { sport: 'Football - NFL', seniority: 'Internship' },
    roleGroups: [
      { title: 'Football Operations', text: 'Interns may assist team logistics, video, equipment, player personnel, scouting, or football administration.' },
      { title: 'Analytics and Technology', text: 'Data, software, strategy, and research internships support both football and team-business decisions.' },
      { title: 'Training Camp', text: 'Short-term camp roles can cover operations, communications, hospitality, events, equipment, and fan experience.' },
      { title: 'Team Business', text: 'Marketing, partnerships, community relations, ticketing, finance, and content programs offer broader entry points.' },
    ],
    skills: ['Organization and reliability in a deadline-driven environment', 'Excel, reporting, or technical skills relevant to the department', 'Football knowledge for team-facing roles', 'Availability for camp, games, evenings, or weekends when stated'],
    searchAdvice: 'Apply early and search each club separately. Some teams label programs as seasonal assistant, training camp staff, fellowship, associate, or gameday operations rather than internship.',
    faqs: [
      { question: 'When do NFL internships open?', answer: 'Schedules differ by club. Summer and training-camp roles often recruit months in advance, while season-long and department internships can appear throughout the year.' },
      { question: 'What are NFL training camp internships?', answer: 'They are short-term roles that help teams operate camp, practices, media, events, hospitality, equipment, and fan activities during the preseason period.' },
      { question: 'Are NFL internships only for sports-management students?', answer: 'No. Teams also recruit students in analytics, computer science, finance, marketing, communications, design, operations, and other disciplines.' },
    ],
    relatedSlugs: ['sports-analytics-internships', 'football-data-analyst-jobs', 'sports-marketing-jobs'],
  },
  {
    slug: 'nba-internships',
    title: 'NBA Internships and Basketball Internships',
    shortTitle: 'NBA Internships',
    description: 'Find current NBA internships and basketball internships in analytics, operations, marketing, media, partnerships, and team business.',
    keywords: ['NBA internships', 'NBA summer internships', 'basketball internships', 'NBA G League internships'],
    badge: 'Student roles in professional basketball',
    intro: 'Explore internships with NBA and G League organizations and the wider professional basketball ecosystem. Programs can support basketball operations, analytics, media, marketing, partnerships, ticketing, community work, and events.',
    jobsHeading: 'Latest NBA and Basketball Internships',
    emptyMessage: 'No closely matching NBA internships are visible right now. Check back as league, team, and summer programs open.',
    filters: { sport: 'Basketball', seniority: 'Internship' },
    matchAny: ['nba', 'g league', 'basketball operations'],
    roleGroups: [
      { title: 'Basketball Operations', text: 'Internships may support scouting, video, research, player development, team logistics, and front-office administration.' },
      { title: 'Analytics and Strategy', text: 'Technical programs can involve basketball data, business intelligence, ticketing, pricing, or fan insights.' },
      { title: 'Media and Marketing', text: 'Content, production, social, communications, and brand teams recruit students to support year-round storytelling.' },
      { title: 'Partnerships and Events', text: 'Commercial and community teams offer experience in sponsorship activation, game presentation, events, and fan programs.' },
    ],
    skills: ['Strong organization and communication', 'Basketball knowledge where the department requires it', 'Excel, SQL, visualization, video, content, or CRM skills', 'Availability aligned with the program and basketball calendar'],
    searchAdvice: 'Search the NBA, individual teams, G League affiliates, arenas, ownership groups, and media or technology partners. The employer name may differ from the team brand.',
    faqs: [
      { question: 'When are NBA internships posted?', answer: 'There is no single calendar. Summer programs often recruit well in advance, while team, season, and event internships can appear at other times.' },
      { question: 'Does the NBA offer analytics internships?', answer: 'League and team organizations periodically recruit for basketball analytics, data science, business intelligence, strategy, and related technical programs.' },
      { question: 'Are NBA internships paid?', answer: 'Compensation and eligibility vary by employer. Review every posting for pay, academic status, location, relocation, and working-hour requirements.' },
    ],
    relatedSlugs: ['wnba-jobs', 'sports-analytics-internships', 'sports-data-analyst-jobs'],
  },
];

export const jobLandingPages = Object.fromEntries(
  configs.map((config) => [config.slug, config])
) as Record<string, JobLandingPageConfig>;

export const jobLandingPageSlugs = configs.map((config) => config.slug);

export function filterLandingPageJobs(config: JobLandingPageConfig, jobs: LandingPageJob[]) {
  if (!config.matchAny?.length) return jobs.slice(0, 10);

  const matches = jobs.filter((job) => {
    const text = [job.title, job.company, job.sport_list, job.job_area, job.seniority]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return config.matchAny!.some((term) => text.includes(term));
  });

  return matches.slice(0, 10);
}
