const nodemailer = require("nodemailer");
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

// Import Variable
const OAUTH_PLAYGRAROUT = "https://developers.google.com/oauthplayground";

// Send Mail

const sendEMail = async (to: string, url: string, text: string) => {
  // Import Variable
  const CLIENT_ID = `${process.env.MAIL_CLIENT_ID}`;
  const CLIENT_SECRET = `${process.env.MAIL_CLIENT_SECRET}`;
  const REFRESH_TOKEN = `${process.env.MAIL_REFRESH_TOKEN}`;
  const SENDER_MAIL = `${process.env.SENDER_EMAIL_ADRESS}`;

  const oAuth = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, OAUTH_PLAYGRAROUT);
  try {
    oAuth.setCredentials({ refresh_token: REFRESH_TOKEN });
    const access_token = await oAuth.getAccessToken();
    // Config Transport
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: SENDER_MAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        access_token,
      },
    });
    // Mail Option
    const mailOption = {
      from: SENDER_MAIL,
      to,
      subject: "Verify Your Account Please",
      html: `
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome TSApp</h2>
        <p>Congratulations! You're almost set to start using TSApp.
            Just click the button below to validate your email address.
        </p>
        
        <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${text}</a>
    
        <p>If the button doesn't work for any reason, you can also click on the link below:</p>
    
        <div>${url}</div>
        </div>
        `,
    };
    // mail Sanding
    const result = await transport.sendMail(mailOption);
    return result;
  } catch (err) {
    console.log(err);
  }
};

export { sendEMail };
