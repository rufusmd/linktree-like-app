export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { email, spreadsheetId } = await request.json();

    if (!email || !spreadsheetId) {
      return new Response(
        JSON.stringify({ error: "Email and spreadsheet ID are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const spreadsheetLinks = {
      spreadsheet_1: "https://example.com/spreadsheet1",
      spreadsheet_2: "https://example.com/spreadsheet2",
      spreadsheet_3: "https://example.com/spreadsheet3",
    };

    const selectedLink = spreadsheetLinks[spreadsheetId];

    if (!selectedLink) {
      return new Response(
        JSON.stringify({ error: "Invalid spreadsheet ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: "rufus@drrufus.com", name: "Dr. Rufus Financial" },
        subject: "Your Free Financial Spreadsheet",
        content: [{
          type: "text/html",
          value: `
            <p>Hi there!</p>
            <p>Here's the link to your requested spreadsheet:</p>
            <a href="${selectedLink}">Download Spreadsheet</a>
            <p>Thanks for following along!</p>
          `
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('SendGrid API Error:', errorData);
      throw new Error('Failed to send email via SendGrid');
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error sending email:", error);

    return new Response(
      JSON.stringify({ 
        error: "Failed to send email", 
        details: error.message 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
