import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { DEFAULT_JOB_LOGO_URL } from '@/lib/jobLogo';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

// Get base URL from environment or construct from request
const getBaseUrl = (req: NextRequest) => {
    return process.env.NEXT_PUBLIC_BASE_URL || 
           `${req.headers.get('x-forwarded-proto') || 'http'}://${req.headers.get('host')}`;
};

export async function POST(req: NextRequest) {
    try {
        const jobData = await req.json();
        const baseUrl = getBaseUrl(req);

        let logoUrl = null;
        if (jobData.companyLogo && jobData.logoFile) {
            const uploadResponse = await fetch(`${baseUrl}/api/upload-logo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company: jobData.company,
                    image: jobData.logoFile
                })
            });

            if (!uploadResponse.ok) {
                throw new Error('Logo upload failed');
            }

            const { url } = await uploadResponse.json();
            logoUrl = url;
        }

        // Calculate total price
        let totalAmount = 50; // Base price: $50
        if (jobData.companyLogo) totalAmount += 49; // Updated logo price

        // Store the full job payload in the backend. Stripe metadata values are
        // limited to 500 characters, so Checkout only receives the draft ID.
        const pendingJobData = {
            company: jobData.company,
            name: jobData.name,
            description: jobData.description,
            location: jobData.location,
            salary: jobData.salary,
            remote_office: jobData.remote_office,
            url: jobData.applicationUrl,
            country: jobData.country,
            skills: jobData.skills,
            seniority: jobData.seniority,
            language: ['English'],
            sport_list: null,
            industry: null,
            hours: 'Full Time',
            featured: '0 - top',
            logo_permanent_url: logoUrl || DEFAULT_JOB_LOGO_URL,
            creation_date: new Date().toISOString()
        };

        const pendingJobResponse = await fetch(`http://${process.env.HETZNER_POSTGRES_HOST}:8000/pending_job_postings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.HEADER_AUTHORIZATION}`
            },
            body: JSON.stringify(pendingJobData)
        });

        if (!pendingJobResponse.ok) {
            throw new Error(`Pending job creation failed: ${await pendingJobResponse.text()}`);
        }

        const { pending_job_id: pendingJobId } = await pendingJobResponse.json();
        if (!pendingJobId || typeof pendingJobId !== 'string') {
            throw new Error('Pending job creation failed: invalid response');
        }

        console.log('Creating Stripe session with data:', {
            amount: totalAmount,
            description: `Job listing for ${jobData.name} at ${jobData.company}`,
            pendingJobId
        });

        // Create Stripe session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: totalAmount * 100,
                        product_data: {
                            name: 'Job Posting',
                            description: `Job listing for ${jobData.name.replace(/["']/g, '')} at ${jobData.company.replace(/["']/g, '')}${jobData.companyLogo ? ' (includes company logo)' : ''}`.substring(0, 255),
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/post-job/success?session_id={CHECKOUT_SESSION_ID}&value=${totalAmount}`,
            cancel_url: `${baseUrl}/post-job?canceled=true`,
            metadata: {
                jobPosting: 'true',
                pendingJobId
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Stripe session creation error:', error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Error creating job posting',
                details: error
            },
            { status: 500 }
        );
    }
}
