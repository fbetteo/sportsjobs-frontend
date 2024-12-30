import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

// Replace old config with new route segment config
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

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
        logo_permanent_url: jobData.logoUrl || "https://cdn.sportsjobs.online/blogposts/images/sportsjobs_logo.png", // Use the uploaded URL
        has_logo: !!jobData.logoUrl,
        post_tier: jobData.featuredListing ? "Featured" : "Standard",
        payment_id: session.id,
        payment_status: "completed",
        payment_amount: session.amount_total,
    };
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = headers().get('stripe-signature');
        
        if (!signature) {
            console.error('No stripe signature found');
            return NextResponse.json(
                { error: 'No signature found' },
                { status: 400 }
            );
        }

        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        console.log('Webhook received:', event.type);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const jobData = JSON.parse(session.metadata?.jobData || '{}');
            
            // First create job in database
            const formattedJobData = formatJobData(jobData, session);
            
            const response = await fetch(`http://${process.env.HETZNER_POSTGRES_HOST}:9000/add_job`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.HEADER_AUTHORIZATION}` // Match authorization header
                },
                body: JSON.stringify(formattedJobData)
            });

            if (!response.ok) {
                throw new Error(`Job creation failed: ${await response.text()}`);
            }

            console.log('Job created in database with logo');
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Webhook handler failed' },
            { status: 400 }
        );
    }
}
