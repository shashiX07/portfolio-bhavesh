import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Add this line to extend function timeout for deployment platforms that support it
export const config = {
  maxDuration: 60
};

export async function POST(request: Request) {
  try {
    // Get form data
    const formData = await request.json();
    const { name, email, message } = formData;
    
    // Input validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }
    
    // Create email transporter with optimized settings for Gmail
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 567, // Use SSL port
      secure: true, // Use SSL
      connectionTimeout: 100000, // 100 second timeout
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    
    // Email content
    const mailOptions = {
      from: `Portfolio <${process.env.FROM_EMAIL}>`,
      to: process.env.TO_EMAIL,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <h4>Message:</h4>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };
    
    // Send email with promise and timeout protection
    await new Promise((resolve, reject) => {
      // Add timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        reject(new Error('SMTP connection timed out'));
      }, 25000); // 25 second timeout
      
      transporter.sendMail(mailOptions, (error, info) => {
        clearTimeout(timeoutId);
        if (error) {
          console.error('SMTP error:', error);
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
    
    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    // Ensure we always return a proper JSON response even for errors
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}