import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

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
        let totalAmount = 199; // Base price: $199
        if (jobData.companyLogo) totalAmount += 49; // Updated logo price

        // Clean job data before sending to Stripe
        const cleanJobData = {
            company: jobData.company,
            name: jobData.name,
            description: jobData.description,
            location: jobData.location,
            salary: jobData.salary,
            remote_office: jobData.remote_office,
            applicationUrl: jobData.applicationUrl,
            country: jobData.country,
            skills: jobData.skills,
            logoUrl,
            timestamp: new Date().toISOString()
        };

        console.log('Creating Stripe session with data:', {
            amount: totalAmount,
            description: `Job listing for ${jobData.name} at ${jobData.company}`,
            metadata: cleanJobData
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
                            description: `Job listing for ${jobData.name} at ${jobData.company}${jobData.companyLogo ? ' (includes company logo)' : ''}`.substring(0, 255),
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/post-job/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/post-job?canceled=true`,
            metadata: {
                jobData: JSON.stringify(cleanJobData)
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
