
import fetch from 'node-fetch';

export async function getAuth0AccessToken() {
  console.log("getaccessCall")
  const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials'
    })
  });
    
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error fetching access token');
  }

  const data = await response.json();
  return data.access_token;
}

export async function createAuth0User(email: string, password: string, accessToken: string) {
  const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      connection: 'Username-Password-Authentication',
      email,
      password
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error creating user');
  }

  const data = await response.json();
  return data;
}
