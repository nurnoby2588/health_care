import nodemailer from "nodemailer";
import config from "../config";
type EmailSender = {
    email: string,
    subject: string,
    text?: any | null | undefined,
    html: any
}
const emailSender = async (
    email: any, subject: any, html: any,text?: any | null | undefined
) => {
    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
        host: config.emailSender.host,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: config.emailSender.user,
            pass: config.emailSender.pass,
        },
    });


    const info = await transporter.sendMail({
        from: '"Health Care" <nurnoby123456789@gmail.com>',
        to: email,
        subject: subject,
        text: text ? text : null,
        html: html,
    });

    console.log("Message sent:", info.messageId);

}
export default emailSender