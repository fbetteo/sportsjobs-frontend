// lib/jobSalary.ts
// Parses free-text scraped salaries into schema.org MonetaryAmount data for JobPosting.
// Returns null whenever currency or pay period is ambiguous: omitting baseSalary is
// better than telling Google a wrong figure (e.g. "$147,000" read as 147).

type SalaryUnit = 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export interface ParsedSalary {
    currency: string;
    minValue: number;
    maxValue: number;
    unitText: SalaryUnit;
}

// Order matters: prefixed dollars (CA$, AU$) must be checked before the bare "$".
const CURRENCY_PATTERNS: Array<[RegExp, string]> = [
    [/\bCAD\b|CA?\$/i, 'CAD'],
    [/\bAUD\b|AU?\$/i, 'AUD'],
    [/\bUSD\b|US\$|\$/i, 'USD'],
    [/\bGBP\b|£/i, 'GBP'],
    [/\bEUR\b|€/i, 'EUR'],
];

const UNIT_PATTERNS: Array<[RegExp, SalaryUnit]> = [
    [/\/\s*(hour|hr)\b|per\s+hour|hourly|\bph\b/i, 'HOUR'],
    [/\/\s*day\b|per\s+day|daily/i, 'DAY'],
    [/\/\s*week\b|per\s+week|weekly/i, 'WEEK'],
    [/\/\s*(month|mo)\b|per\s+month|monthly/i, 'MONTH'],
    [/\/\s*(year|yr)\b|per\s+(year|annum)|annual|yearly|\bp\.?a\.?\b/i, 'YEAR'],
];

// Below this an amount with no stated period could be monthly, hourly, or a stipend.
const MIN_IMPLIED_ANNUAL = 10000;

export function parseSalary(raw?: string | null): ParsedSalary | null {
    if (!raw) return null;
    const text = raw.trim();

    const currency = CURRENCY_PATTERNS.find(([pattern]) => pattern.test(text))?.[1];
    if (!currency) return null;

    // Amounts like "147,000", "83K", "19.29"; commas are thousands separators in this data.
    const amounts = Array.from(text.matchAll(/(\d[\d,]*(?:\.\d+)?)\s*([kK])?\b/g))
        .map(([, num, k]) => parseFloat(num.replace(/,/g, '')) * (k ? 1000 : 1))
        .filter((value) => Number.isFinite(value) && value > 0);
    if (amounts.length === 0 || amounts.length > 2) return null;

    let unitText = UNIT_PATTERNS.find(([pattern]) => pattern.test(text))?.[1];
    if (!unitText) {
        // Any other "per ..." (e.g. "per completed match") is a unit schema.org can't express.
        if (/\bper\b|\//i.test(text)) return null;
        if (Math.min(...amounts) < MIN_IMPLIED_ANNUAL) return null;
        unitText = 'YEAR';
    }

    const minValue = Math.min(...amounts);
    const maxValue = Math.max(...amounts);
    return { currency, minValue, maxValue, unitText };
}

export function buildBaseSalarySchema(raw?: string | null) {
    const salary = parseSalary(raw);
    if (!salary) return undefined;

    const value = salary.minValue === salary.maxValue
        ? { value: salary.minValue }
        : { minValue: salary.minValue, maxValue: salary.maxValue };

    return {
        '@type': 'MonetaryAmount',
        currency: salary.currency,
        value: {
            '@type': 'QuantitativeValue',
            ...value,
            unitText: salary.unitText,
        },
    };
}
