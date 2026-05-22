export interface AnalyticsSearchJob {
    id: string;
    job_id?: string;
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
    start_date?: string;
    description?: string;
    skills?: string[] | string;
}

export interface InventorySummary {
    total: number;
    focusCounts: Array<[string, number]>;
    workModeCounts: Array<[string, number]>;
    seniorityCounts: Array<[string, number]>;
    sportCounts: Array<[string, number]>;
}

export const teamworkOnlineFaqItems = [
    {
        question: 'Is TeamWork Online legit?',
        answer: 'Yes. TeamWork Online is a long-running sports and entertainment hiring platform used by teams, leagues, colleges, and other organizations. The bigger question for job seekers is fit: it is legitimate, but it is still a broad sports jobs marketplace rather than an analytics-only destination.',
    },
    {
        question: 'Is TeamWork Online good for sports analytics roles?',
        answer: 'It can be useful, especially when a team, league, or college posts a data analyst, performance analyst, or business intelligence opening there. The tradeoff is that sports analytics is only one slice of a much larger mix that also includes ticketing, operations, event, sales, and venue roles.',
    },
    {
        question: 'What is the difference between TeamWork Online, Teamwork.com, and Teamworks?',
        answer: 'TeamWork Online is the sports hiring platform. Teamwork.com is a project-management software company, and Teamworks is a separate sports technology company. Searchers often mix up the brands, so it helps to look for context like jobs, hiring, teams, leagues, and sports careers.',
    },
    {
        question: 'What is the better option for sports analytics job seekers?',
        answer: 'If you want the broadest sports and entertainment board, TeamWork Online can still be worth checking. If you want a narrower path to sports analytics, data scientist, business intelligence, performance analyst, sports betting, and remote jobs, a more specialized search like SportsJobs Online is usually the faster fit.',
    },
];

const analyticsSignalPattern =
    /\b(analytics|analyst|data analyst|data science|data scientist|data engineering|data engineer|business intelligence|bi\b|insights|research|strategy|pricing|revenue|forecast|forecasting|statistics|statistical|model|modeling|sql|python|r\b|machine learning|performance analyst|quant|trading|odds|sports betting|sportsbook)\b/i;

const weakSignalPattern =
    /\b(operations analyst|reporting|dashboard|crm|fan insights|audience insights|research assistant|business analyst)\b/i;

const nonAnalyticsPattern =
    /\b(security|concessions|usher|parking|janitor|cook|chef|bartender|housekeeping|merchandise associate|groundskeeper|maintenance technician)\b/i;

function getSearchText(job: AnalyticsSearchJob) {
    const skills = Array.isArray(job.skills) ? job.skills.join(' ') : job.skills ?? '';
    return [job.title, job.job_area, job.company, job.sport_list, job.description, skills, job.seniority]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
}

export function isAnalyticsRelevant(job: AnalyticsSearchJob) {
    const text = getSearchText(job);

    if (!text) {
        return false;
    }

    if (!analyticsSignalPattern.test(text) && !weakSignalPattern.test(text)) {
        return false;
    }

    if (nonAnalyticsPattern.test(text) && !/\b(analytics|analyst|data|insights|research|intelligence|pricing|science)\b/i.test(text)) {
        return false;
    }

    return true;
}

export function filterAnalyticsJobs(jobs: AnalyticsSearchJob[]) {
    return jobs.filter(isAnalyticsRelevant);
}

export function getAnalyticsFocus(job: AnalyticsSearchJob) {
    const text = getSearchText(job);

    if (/\b(betting|sportsbook|odds|trading|quant|risk)\b/i.test(text)) {
        return 'Betting and quant';
    }

    if (/\b(performance|player|scout|scouting|video|sport science|baseball operations|basketball operations|football operations|hockey operations|soccer operations)\b/i.test(text)) {
        return 'Performance analytics';
    }

    if (/\b(data scientist|machine learning|data science|data engineer|analytics engineer|model|modeling|forecast)\b/i.test(text)) {
        return 'Data science and engineering';
    }

    if (/\b(business intelligence|bi\b|pricing|ticket|revenue|crm|fan|audience|sponsorship|marketing analytics|insights|strategy|research)\b/i.test(text)) {
        return 'Business intelligence';
    }

    return 'General analytics';
}

export function getWorkMode(job: AnalyticsSearchJob) {
    const text = `${job.remote_string ?? ''} ${job.location ?? ''}`.toLowerCase();

    if (text.includes('hybrid')) {
        return 'Hybrid jobs';
    }

    if (text.includes('remote')) {
        return 'Remote jobs';
    }

    if (text.includes('on-site') || text.includes('onsite') || text.includes('office')) {
        return 'Onsite jobs';
    }

    return 'Work setting not listed';
}

export function getSeniorityBucket(job: AnalyticsSearchJob) {
    const text = `${job.seniority ?? ''} ${job.title ?? ''}`.toLowerCase();

    if (/\b(intern|internship|student)\b/i.test(text)) {
        return 'Internships';
    }

    if (/\b(entry|junior|assistant|coordinator|associate)\b/i.test(text)) {
        return 'Entry level';
    }

    if (/\b(manager|director|head|lead|principal|vp|vice president|executive|chief|senior)\b/i.test(text)) {
        return 'Senior and leadership';
    }

    return 'Mid-career';
}

export function getSportBucket(job: AnalyticsSearchJob) {
    const sport = (job.sport_list ?? '').toLowerCase();

    if (sport.includes('basketball')) {
        return 'Basketball';
    }

    if (sport.includes('football')) {
        return 'Football';
    }

    if (sport.includes('baseball')) {
        return 'Baseball';
    }

    if (sport.includes('hockey')) {
        return 'Hockey';
    }

    if (sport.includes('soccer')) {
        return 'Soccer';
    }

    if (sport.includes('golf')) {
        return 'Golf';
    }

    if (sport.includes('multi') || sport.includes('general')) {
        return 'Multi-sport';
    }

    if (!sport.trim()) {
        return 'Sport not listed';
    }

    return job.sport_list ?? 'Other sports';
}

function sortCountEntries(entries: Map<string, number>) {
    return Array.from(entries.entries()).sort((a, b) => {
        if (b[1] !== a[1]) {
            return b[1] - a[1];
        }

        return a[0].localeCompare(b[0]);
    });
}

export function buildAnalyticsInventory(jobs: AnalyticsSearchJob[]): InventorySummary {
    const focusCounts = new Map<string, number>();
    const workModeCounts = new Map<string, number>();
    const seniorityCounts = new Map<string, number>();
    const sportCounts = new Map<string, number>();

    jobs.forEach((job) => {
        const focus = getAnalyticsFocus(job);
        const workMode = getWorkMode(job);
        const seniority = getSeniorityBucket(job);
        const sport = getSportBucket(job);

        focusCounts.set(focus, (focusCounts.get(focus) ?? 0) + 1);
        workModeCounts.set(workMode, (workModeCounts.get(workMode) ?? 0) + 1);
        seniorityCounts.set(seniority, (seniorityCounts.get(seniority) ?? 0) + 1);
        sportCounts.set(sport, (sportCounts.get(sport) ?? 0) + 1);
    });

    return {
        total: jobs.length,
        focusCounts: sortCountEntries(focusCounts),
        workModeCounts: sortCountEntries(workModeCounts),
        seniorityCounts: sortCountEntries(seniorityCounts),
        sportCounts: sortCountEntries(sportCounts),
    };
}
