import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendOTPEmail(to: string, otpCode: string) {
    const mailOptions = {
      from: `"AuthApp" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Verify Your Email',
      html: `
        <h3>Welcome to AuthApp 🎉</h3>
        <p>Your verification code is:</p>
        <h2>${otpCode}</h2>
        <p>This code is valid for 15 minutes.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email Error:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async sendResetToken(to: string, resetToken: string) {
    const mailOptions = {
      from: `"AuthApp" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Password Reset Request',
      html: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password:</p>
        <a href="https://yourfrontend.com/reset-password?token=${resetToken}">Reset Password</a>
        <p>This link expires in 30 minutes.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Reset Email Error:', error);
      throw new InternalServerErrorException('Failed to send password reset email');
    }
  }
}
