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
          price: plan === 'Monthly' ? process.env.STRIPE_MONTHLY_PRICE_ID! : process.env.STRIPE_YEARLY_PRICE_ID!
        }
      ],
      expand: ['latest_invoice.payment_intent']
    });
      
    console.log(subscription);

      if (subscription.latest_invoice.payment_intent?.status === 'succeeded') {
          const accessToken = await getAuth0AccessToken();
          console.log(accessToken)
          console.log(email)
          console.log(password)

        // Create a user in Auth0
        await createAuth0User(email, password, accessToken);
  
        // Create a record in Airtable
        await createAirtableRecord(email, plan);
      // Create a user account in your database here

      return NextResponse.json({ status: 'active' });
    } else {
      return NextResponse.json({ status: 'incomplete' });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
