import nodemailer from 'nodemailer';

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);


const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendEmail = async (email: string, complaintId: string, name: string, note?: string) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Your Complaint Has Been Resolved`,
        html: `
            <h2>Complaint Resolved!</h2>
            <p>Dear ${name},</p>
            <p>We're happy to inform you that your complaint whose ID : <strong>${complaintId}</strong> has been resolved.</p>
            <p>You can track the status anytime by visiting our portal with your complaint ID or email.</p>
            <p>Thank you for reporting!</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
};