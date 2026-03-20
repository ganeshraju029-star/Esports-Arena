const nodemailer = require('nodemailer');
const winston = require('winston');

class EmailService {
  constructor() {
    this.transporter = null;
    this.init();
  }

  init() {
    try {
      this.transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      winston.info('Email service initialized');
    } catch (error) {
      winston.error('Failed to initialize email service:', error);
    }
  }

  async sendEmail(options) {
    try {
      const mailOptions = {
        from: `"Esports Arena" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      winston.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      winston.error('Error sending email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(user) {
    try {
      const subject = 'Welcome to Esports Arena!';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Welcome to Esports Arena, ${user.username}!</h2>
          <p>Thank you for joining our gaming platform. Get ready to compete in exciting tournaments and win amazing prizes!</p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>What's next?</h3>
            <ul>
              <li>Complete your profile with game IDs</li>
              <li>Browse upcoming tournaments</li>
              <li>Add funds to your wallet</li>
              <li>Join your first tournament</li>
            </ul>
          </div>
          <p>If you have any questions, feel free to contact our support team.</p>
          <p>Happy Gaming!</p>
          <hr>
          <p style="color: #6B7280; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `;

      await this.sendEmail({
        to: user.email,
        subject,
        html,
        text: `Welcome to Esports Arena, ${user.username}! Get ready to compete in exciting tournaments.`
      });

      winston.info(`Welcome email sent to ${user.email}`);
    } catch (error) {
      winston.error('Error sending welcome email:', error);
    }
  }

  async sendTournamentJoinedEmail(user, tournament) {
    try {
      const subject = `Successfully joined ${tournament.title}`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Tournament Registration Confirmed!</h2>
          <p>Hi ${user.username},</p>
          <p>You have successfully registered for the following tournament:</p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>${tournament.title}</h3>
            <p><strong>Game:</strong> ${tournament.game.toUpperCase()}</p>
            <p><strong>Mode:</strong> ${tournament.mode}</p>
            <p><strong>Date:</strong> ${new Date(tournament.schedule.tournamentStart).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date(tournament.schedule.tournamentStart).toLocaleTimeString()}</p>
            <p><strong>Entry Fee:</strong> ₹${tournament.entryFee}</p>
          </div>
          <p>Room details will be shared before the tournament starts. Make sure to check your dashboard for updates.</p>
          <p>Good luck!</p>
          <hr>
          <p style="color: #6B7280; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `;

      await this.sendEmail({
        to: user.email,
        subject,
        html,
        text: `You have successfully registered for ${tournament.title}.`
      });

      winston.info(`Tournament joined email sent to ${user.email}`);
    } catch (error) {
      winston.error('Error sending tournament joined email:', error);
    }
  }

  async sendPaymentConfirmationEmail(user, transaction) {
    try {
      const subject = 'Payment Confirmed';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Payment Successful!</h2>
          <p>Hi ${user.username},</p>
          <p>Your payment has been successfully processed:</p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Payment Details</h3>
            <p><strong>Amount:</strong> ₹${transaction.amount}</p>
            <p><strong>Type:</strong> ${transaction.type.replace('_', ' ').toUpperCase()}</p>
            <p><strong>Transaction ID:</strong> ${transaction.paymentId}</p>
            <p><strong>Date:</strong> ${new Date(transaction.createdAt).toLocaleDateString()}</p>
          </div>
          ${transaction.type === 'deposit' ? 
            `<p>Your wallet has been credited with ₹${transaction.amount}. You can now use this balance to join tournaments.</p>` :
            `<p>Your tournament entry fee has been paid successfully.</p>`
          }
          <p>Thank you for using Esports Arena!</p>
          <hr>
          <p style="color: #6B7280; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `;

      await this.sendEmail({
        to: user.email,
        subject,
        html,
        text: `Your payment of ₹${transaction.amount} has been processed successfully.`
      });

      winston.info(`Payment confirmation email sent to ${user.email}`);
    } catch (error) {
      winston.error('Error sending payment confirmation email:', error);
    }
  }

  async sendPasswordResetEmail(user, resetToken) {
    try {
      const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      const subject = 'Password Reset Request';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Password Reset</h2>
          <p>Hi ${user.username},</p>
          <p>You requested a password reset for your Esports Arena account.</p>
          <p>Click the link below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetURL}" style="background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in 10 minutes.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr>
          <p style="color: #6B7280; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `;

      await this.sendEmail({
        to: user.email,
        subject,
        html,
        text: `Reset your password: ${resetURL}`
      });

      winston.info(`Password reset email sent to ${user.email}`);
    } catch (error) {
      winston.error('Error sending password reset email:', error);
    }
  }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = emailService;
