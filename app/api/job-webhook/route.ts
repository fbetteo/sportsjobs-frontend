import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { format, parse } from 'date-fns';
import { DEFAULT_JOB_LOGO_URL } from '@/lib/jobLogo';
// Replace old config with new route segment config
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

const backendUrl = `http://${process.env.HETZNER_POSTGRES_HOST}:8000`;

const formatJobData = (jobData: any, session: Stripe.Checkout.Session) => {
    const now = new Date().toISOString();
    
    // Match format from /api/get-jobs/route.ts response
    // Map the form data to database schema
    return {
        name: jobData.name,
        company: jobData.company,
        description: jobData.description,
        location: jobData.location,
        url: jobData.applicationUrl,
        salary: jobData.salary || null,
        skills: jobData.skills || null,
        country: jobData.country, // Default for now 
        country_code: "US",      // Default for now
        remote_office: jobData.remote_office || "Office",
        language: jobData.language || ["English"],
        sport_list: jobData.sport_list || null,       // Add to form later
        industry: jobData.industry || null,         // Add to form later
        job_area: jobData.job_area || null,         // Add to form later 
        job_type: jobData.job_type || "Permanent",  // Default for now
        seniority: jobData.seniority || "With Experience",
        featured: "0 - top",
        creation_date: now,
        hours: jobData.hours || "Full Time",     // Default for now
        logo_permanent_url: jobData.logoUrl || DEFAULT_JOB_LOGO_URL,
        has_logo: !!jobData.logoUrl,
        post_tier: jobData.featuredListing ? "Featured" : "Standard",
        payment_id: session.id,
        payment_status: "completed",
        payment_amount: session.amount_total,
    };
};

const publishPendingJob = async (pendingJobId: string, session: Stripe.Checkout.Session) => {
    const response = await fetch(`${backendUrl}/pending_job_postings/${encodeURIComponent(pendingJobId)}/publish`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.HEADER_AUTHORIZATION}`
        },
        body: JSON.stringify({ stripe_session_id: session.id })
    });

    if (!response.ok) {
        throw new Error(`Pending job publishing failed: ${await response.text()}`);
    }

    console.log('Pending job published:', pendingJobId);
};

const publishLegacyJob = async (jobDataValue: string, session: Stripe.Checkout.Session) => {
    const jobData = JSON.parse(jobDataValue);

    // Additional verification: job postings must have these fields
    if (!jobData.company || !jobData.name || !jobData.description) {
        console.log('Invalid legacy job data format, skipping...');
        return;
    }

    const formattedJobData = formatJobData(jobData, session);

    const response = await fetch(`${backendUrl}/add_job`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.HEADER_AUTHORIZATION}`
        },
        body: JSON.stringify(formattedJobData)
    });

    if (!response.ok) {
        throw new Error(`Legacy job creation failed: ${await response.text()}`);
    }

    console.log('Legacy job created in database');
};

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = headers().get('stripe-signature');
    
    if (!signature) {
        console.error('No stripe signature found');
        return NextResponse.json(
            { error: 'No signature found' },
            { status: 400 }
        );
    }

    // console.log('Stripe-Signature:', signature);
    // console.log('Webhook Secret:', process.env.STRIPE_WEBHOOK_SECRET);

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        console.error('Webhook signature error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Webhook signature verification failed' },
            { status: 400 }
        );
    }

    console.log('Webhook received:', event.type);

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        
        try {
            if (session.metadata?.pendingJobId) {
                await publishPendingJob(session.metadata.pendingJobId, session);
            } else if (session.metadata?.jobData) {
                // Temporary compatibility for Checkout sessions opened before
                // pending job storage was deployed.
                await publishLegacyJob(session.metadata.jobData, session);
            } else {
                console.log('Not a job posting webhook, skipping...');
            }
        } catch (error) {
            console.error('Error processing job data:', error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : 'Webhook job processing failed' },
                { status: 500 }
            );
        }
    }

    return NextResponse.json({ received: true });
}
