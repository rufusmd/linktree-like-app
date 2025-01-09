import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
  try {
    const { email, spreadsheetId } = await req.json();

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
