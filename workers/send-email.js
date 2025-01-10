export default {
    async fetch(request, env, ctx) {
      // Handle CORS preflight requests
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*', // Replace with your frontend domain in production
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        });
      }

      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
      }
  
      try {
        const requestBody = await request.json();
        const { email, spreadsheetId } = requestBody;
  
        if (!email || !spreadsheetId) {
          return new Response(JSON.stringify({ success: false, message: 'Missing email or spreadsheetId' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*', // Replace with your frontend domain in production
            },
          });
        }
  
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(env.SENDGRID_API_KEY);
  
        const msg = {
          to: email,
          from: 'rufus@drrufus.com', // Replace with your verified SendGrid sender
          subject: 'Your Spreadsheet Link',
          text: `Here is your requested spreadsheet: ${spreadsheetId}`,
          html: `
            <div>
              <h2>Thank you for your request</h2>
              <p>Here is your requested spreadsheet: <strong>${spreadsheetId}</strong></p>
            </div>
          `,
        };
  
        try {
          await sgMail.send(msg);
          return new Response(JSON.stringify({ success: true, message: 'Email sent successfully' }), {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*', // Replace with your frontend domain in production
            },
          });
        } catch (sendGridError) {
          console.error("SendGrid Send Error:", sendGridError);
          return new Response(JSON.stringify({ success: false, message: `SendGrid error: ${sendGridError.message}` }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*', // Replace with your frontend domain in production
            },
          });
        }
      } catch (parseError) {
        console.error("Request Body Parse Error:", parseError);
        return new Response(JSON.stringify({ success: false, message: 'Invalid request body' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Replace with your frontend domain in production
          },
        });
      }
    },
};