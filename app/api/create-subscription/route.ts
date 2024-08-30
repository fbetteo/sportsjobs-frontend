// app/api/create-subscription/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAuth0AccessToken, createAuth0User } from '../../utils/auth0';
import { createAirtableRecord } from '../../utils/airtable';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

export async function POST(req: NextRequest) {
    const { email, paymentMethodId, plan, password } = await req.json();

  try {
    // Create a customer
    const customer = await stripe.customers.create({
      email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });
    // Create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: plan === 'monthly_subscription' ? process.env.STRIPE_MONTHLY_PRICE_ID! : process.env.STRIPE_YEARLY_PRICE_ID!
        }
      ],
      expand: ['latest_invoice.payment_intent']
    });


    const latestInvoice = subscription.latest_invoice as Stripe.Invoice;

    if (latestInvoice && typeof latestInvoice.payment_intent !== 'string' && latestInvoice.payment_intent?.status === 'succeeded') {

      try {
          const accessToken = await getAuth0AccessToken();
          // console.log(accessToken)
          console.log(email)

        // Create a user in Auth0
        await createAuth0User(email, password, accessToken);
      } catch (authError) {
        // Handle Auth0 or Airtable errors
        console.error('Authentication Error:', authError);
        return NextResponse.json(
            {
                error: 'auth0_error',
                message:
                    'Payment succeeded, but there was an error creating your account. Please contact support and do not attempt to pay again.',
            },
            { status: 500 }
        );
    }
  
      try {
        // Create a record in Airtable
        await createAirtableRecord(email, plan);
        // Create a user account in your database here
      } catch (airtableError) {
        console.error('Registration Error:', airtableError);
        return NextResponse.json(
            {
                error: 'airtable_error',
                message:
                    'Payment and user creation succeded, but there was an error adding  your account to the database. Please contact support and do not attempt to pay again. You might be able to log in, but your account may not work fully as expected.',
            },
            { status: 500 }
        );
    }

      return NextResponse.json({ status: 'active' });
    } else {
      return NextResponse.json({ status: 'incomplete' });
    }
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
