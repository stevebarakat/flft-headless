import { NextRequest, NextResponse } from "next/server";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const sanitizedName = sanitizeString(name);
    const sanitizedEmail = sanitizeString(email);
    const sanitizedSubject = sanitizeString(subject);
    const sanitizedMessage = sanitizeString(message);

    const recipientEmail = process.env.CONTACT_EMAIL || "your-email@example.com";
    const fromEmail = process.env.FROM_EMAIL || "noreply@example.com";

    const emailBody = `
New Contact Form Submission

Name: ${sanitizedName}
Email: ${sanitizedEmail}
Subject: ${sanitizedSubject}

Message:
${sanitizedMessage}
`;

    if (process.env.USE_WORDPRESS_EMAIL === "true") {
      const wpRestUrl = process.env.WP_REST_URL || "http://localhost:10023/wp-json";

      try {
        const wpResponse = await fetch(`${wpRestUrl}/wp/v2/contact/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: sanitizedName,
            email: sanitizedEmail,
            subject: sanitizedSubject,
            message: sanitizedMessage,
          }),
        });

        if (!wpResponse.ok) {
          throw new Error("WordPress endpoint failed");
        }

        return NextResponse.json(
          { message: "Contact form submitted successfully" },
          { status: 200 }
        );
      } catch (error) {
        console.error("WordPress email endpoint error:", error);
        return NextResponse.json(
          { error: "Failed to send email via WordPress" },
          { status: 500 }
        );
      }
    }

    if (process.env.EMAIL_SERVICE === "sendgrid" && process.env.SENDGRID_API_KEY) {
      const sendGridResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: recipientEmail }],
              subject: `Contact Form: ${sanitizedSubject}`,
            },
          ],
          from: { email: fromEmail },
          content: [
            {
              type: "text/plain",
              value: emailBody,
            },
          ],
          reply_to: { email: sanitizedEmail, name: sanitizedName },
        }),
      });

      if (!sendGridResponse.ok) {
        const errorText = await sendGridResponse.text();
        console.error("SendGrid error:", errorText);
        return NextResponse.json(
          { error: "Failed to send email" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "Contact form submitted successfully" },
        { status: 200 }
      );
    }

    if (process.env.EMAIL_SERVICE === "resend" && process.env.RESEND_API_KEY) {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: recipientEmail,
          reply_to: sanitizedEmail,
          subject: `Contact Form: ${sanitizedSubject}`,
          text: emailBody,
        }),
      });

      if (!resendResponse.ok) {
        const errorData = await resendResponse.json();
        console.error("Resend error:", errorData);
        return NextResponse.json(
          { error: "Failed to send email" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "Contact form submitted successfully" },
        { status: 200 }
      );
    }

    console.log("Contact form submission:", {
      to: recipientEmail,
      from: sanitizedEmail,
      subject: `Contact Form: ${sanitizedSubject}`,
      body: emailBody,
    });

    return NextResponse.json(
      {
        message: "Contact form submitted successfully",
        note: "Email service not configured. Check server logs for submission details."
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
