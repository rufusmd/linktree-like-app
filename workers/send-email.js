export default {
    async fetch(request, env, ctx) {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
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
        const { email, toolId } = requestBody;  // Changed from spreadsheetId to toolId

        if (!email || !toolId) {
          return new Response(JSON.stringify({ 
            success: false, 
            message: 'Missing email or tool ID' 
          }), {
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
          });
        }

        let spreadsheetLink;
        let spreadsheetName;

        switch (toolId) {
          case 'budgeting':
            spreadsheetLink = 'https://docs.google.com/spreadsheets/d/1WZq28n-Wi8NLQnR0csuzrxi_d4OmUujjmLqD6iQwf40/edit?usp=sharing';
            spreadsheetName = 'Budgeting Spreadsheet';
            break;
          case 'retirement':
            spreadsheetLink = 'https://docs.google.com/spreadsheets/d/1W0Vqmg-Y-xQaGXvDxL_ehWY88czISbVftfiTI5HsKMY/edit?usp=sharing';
            spreadsheetName = 'Retirement Savings Simulator';
            break;
          case 'rentVsBuy':
            spreadsheetLink = 'https://docs.google.com/spreadsheets/d/1fzNGrUfWrFvhMhWr2Th4eJFaDuEvhl7Nc2NVdnNPQIk/edit?usp=sharing';
            spreadsheetName = 'Rent vs. Buy Calculator';
            break;
          default:
            return new Response(JSON.stringify({ 
              success: false, 
              message: 'Invalid tool selected' 
            }), {
              status: 400,
              headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              },
            });
        }
  
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(env.SENDGRID_API_KEY);
  
        const msg = {
          to: email,
          from: 'rufus@drrufus.com',
          subject: `Your ${spreadsheetName} from Dr. Rufus`,
          text: `Thank you for your request! Here is your spreadsheet link: ${spreadsheetLink}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h1 style="color: #4a154b;">Thank you for your request</h1>
              <p>Here is your requested spreadsheet: 
                <a href="${spreadsheetLink}" style="color: #F08162; text-decoration: underline;">
                  Click here to access your ${spreadsheetName}
                </a>
              </p>
              <p style="margin-top: 20px;">
                Direct link (if the button doesn't work): <br>
                ${spreadsheetLink}
              </p>
            </div>
          `,
        };
  
        try {
          await sgMail.send(msg);
          return new Response(JSON.stringify({ success: true, message: 'Email sent successfully' }), {
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
          });
        } catch (sendGridError) {
          console.error("SendGrid Send Error:", sendGridError);
          return new Response(JSON.stringify({ 
            success: false, 
            message: `SendGrid error: ${sendGridError.message}` 
          }), {
            status: 500,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
          });
        }
      } catch (parseError) {
        console.error("Request Body Parse Error:", parseError);
        return new Response(JSON.stringify({ 
          success: false, 
          message: 'Invalid request body' 
        }), {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        });
      }
    },
};