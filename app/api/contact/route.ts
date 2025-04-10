import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Get form data
    const formData = await request.json();
    const { name, email, message } = formData;
    
    // Create optimized transporter - avoid DNS lookups by using IP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,  // Use 465 for SSL
      secure: true, // Use SSL
      connectionTimeout: 5000, // 5 seconds
      greetingTimeout: 5000, // 5 seconds
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    
    // Simplified email options
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: `Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };
    
    // Use a promise with timeout to prevent hanging
    const sendMailPromise = new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
    
    // Add timeout to prevent function hanging
    const result = await Promise.race([
      sendMailPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Email timeout')), 8000))
    ]);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}