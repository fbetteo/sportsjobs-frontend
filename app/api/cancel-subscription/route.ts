import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAuth0AccessToken, disableAuth0User } from '../../utils/auth0';
import { updateAirtableRecord } from '../../utils/airtable';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    
});

export async function POST(req: NextRequest) {
    const { email } = await req.json();

    try {
        // Fetch the customer from Stripe
        const customers = await stripe.customers.list({ email, limit: 1 });
        console.log(customers)
        if (customers.data.length === 0) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }
        const customer = customers.data[0];
        console.log(customer)

        // Cancel the subscription
        const subscriptions = await stripe.subscriptions.list({ customer: customer.id, limit: 1 });
        if (subscriptions.data.length === 0) {
            return NextResponse.json({ error: 'Subscription not found. Please contact via email to franco@sportsjobs.online' }, { status: 404 });
        }
        const subscription = subscriptions.data[0];
        await stripe.subscriptions.update(subscription.id, { cancel_at_period_end: true });

        // Disable the user in Auth0
        const accessToken = await getAuth0AccessToken();
        await disableAuth0User(email, accessToken);

        // Update the Airtable record
        await updateAirtableRecord(email, { plan: 'free' });

        return NextResponse.json({ status: 'canceled' });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
