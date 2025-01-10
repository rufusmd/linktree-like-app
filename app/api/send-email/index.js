import sgMail from "@sendgrid/mail";

export const config = {
  runtime: 'edge',
};

export async function POST(request) {  // Changed from req to request
  try {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not found');
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const { email, spreadsheetId } = await request.json();
    
    // Rest of your code stays the same...
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send email", 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        } 
      }
    );
  }


    const message = {
      to: email,
      from: "rufus@drrufus.com", // Replace with your verified SendGrid email
      subject: "Your Free Financial Spreadsheet",
      text: `Here's the link to your requested spreadsheet: ${selectedLink}`,
      html: `
        <p>Hi there!</p>
        <p>Here's the link to your requested spreadsheet:</p>
        <a href="${selectedLink}">Download Spreadsheet</a>
        <p>Thanks for following along!</p>
      `,
    };

    await sgMail.send(message);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending email:", error);

    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
