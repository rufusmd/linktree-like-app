export default {
    async fetch(request, env, ctx) {
      // CORS Headers setup
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
        'Access-Control-Max-Age': '86400',
      };

      // Handle CORS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: corsHeaders
        });
      }

      const url = new URL(request.url);

      // Submissions endpoint (for admin dashboard)
      if (url.pathname === '/api/submissions') {
        try {
          const submissions = await env.DB.prepare(
            'SELECT * FROM submissions ORDER BY requestedAt DESC'
          ).all();

          return new Response(JSON.stringify(submissions.results || []), {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            }
          });
        } catch (error) {
          console.error('Database error:', error);
          return new Response(JSON.stringify({ error: 'Database error', details: error.message }), {
            status: 500,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            }
          });
        }
      }

      // Email submission endpoint
      if (request.method === 'POST') {
        try {
          const requestBody = await request.json();
          const { email, firstName, lastName, toolId } = requestBody;

          if (!email || !toolId || !firstName || !lastName) {
            return new Response(JSON.stringify({ 
              success: false, 
              message: 'Missing required fields' 
            }), {
              status: 400,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
              }
            });
          }

          // Determine which spreadsheet to send
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
                message: 'Invalid spreadsheet type' 
              }), {
                status: 400,
                headers: {
                  ...corsHeaders,
                  'Content-Type': 'application/json',
                }
              });
          }

          // Store submission in D1
          try {
            await env.DB.prepare(
              'INSERT INTO submissions (firstName, lastName, email, spreadsheetId) VALUES (?, ?, ?, ?)'
            )
            .bind(firstName, lastName, email, toolId)
            .run();
          } catch (dbError) {
            console.error("Database Error:", dbError);
            // Continue with email sending even if DB insert fails
          }

          // Send emails via SendGrid
          const sgMail = require('@sendgrid/mail');
          sgMail.setApiKey(env.SENDGRID_API_KEY);

          // Email to user
          const userMsg = {
            to: email,
            from: 'rufus@drrufus.com',
            subject: `Your ${spreadsheetName} from Dr. Rufus`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1>Your ${spreadsheetName}</h1>
                <p>Thank you for your request! Here's your spreadsheet:</p>
                <p><a href="${spreadsheetLink}" style="color: #F08162;">Click here to access your spreadsheet</a></p>
                <p>Direct link: ${spreadsheetLink}</p>
              </div>
            `,
          };

          // Notification email to you
          const notificationMsg = {
            to: 'rufus@drrufus.com',
            from: 'rufus@drrufus.com',
            subject: 'You got a new submission on Dr. Rufus!',
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1>New Spreadsheet Request</h1>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Requested:</strong> ${spreadsheetName}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              </div>
            `,
          };

          try {
            // Send both emails
            await Promise.all([
              sgMail.send(userMsg),
              sgMail.send(notificationMsg)
            ]);

            return new Response(JSON.stringify({ success: true, message: 'Email sent successfully' }), {
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
              }
            });
          } catch (sendGridError) {
            console.error("SendGrid Error:", {
              message: sendGridError.message,
              response: sendGridError.response?.body,
              code: sendGridError.code
            });
            
            return new Response(JSON.stringify({ 
              success: false, 
              message: `SendGrid error: ${sendGridError.message}` 
            }), {
              status: 500,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
              }
            });
          }
        } catch (error) {
          console.error("Error:", error);
          return new Response(JSON.stringify({ 
            success: false, 
            message: 'Server error' 
          }), {
            status: 500,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            }
          });
        }
      }

      return new Response('Not Found', { status: 404 });
    },
};