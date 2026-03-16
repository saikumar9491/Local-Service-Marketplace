import nodemailer from "nodemailer";

// Using a mock transport since we might not have real SMTP credentials yet.
// In a real environment, you would use:
// nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL, pass: process.env.APP_PASSWORD } })
const transporter = nodemailer.createTransport({
    streamTransport: true, // This correctly prints the email to the console instead of sending real emails
    newline: 'windows'
});

export const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"ServiceMarket Auth" <no-reply@servicemarket.com>',
            to,
            subject,
            text,
            html,
        });
        
        console.log("===============================");
        console.log(`✉️ EMAIL EMULATOR DETECTED: Sending email to ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: \n${text}`);
        console.log("===============================");
        
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error: error.message };
    }
};
