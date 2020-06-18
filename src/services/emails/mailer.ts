import { Service, Inject } from 'typedi';
import { IUser } from '../../interfaces/IUser';
import Email from 'email-templates';

@Service()
export default class MailerService {
  constructor(@Inject('emailClient') private emailClient, @Inject('logger') private logger) {}

  public async SendWelcomeEmail(user) {
    /**
     * @TODO Call Mailchimp/Sendgrid or whatever
     */
    // Added example for sending mail from mailgun

    // verify connection configuration
    this.emailClient.verify(error => {
      if (error) {
        this.logger.info('Email error: ', error);
      } else {
        this.logger.info('Email provider is successful');
      }
    });
    const email = new Email({
      views: { root: __dirname },
      message: {
        from: 'support@uyofoods.com',
      },
      // uncomment below to send emails in development/test env:
      send: true,
      transport: this.emailClient,
    });

    email
      .send({
        template: 'welcome',
        message: {
          to: user.email,
        },
        locals: {
          productName: 'Uyo Foods',
          name: user.name,
        },
      })
      .catch(err => this.logger.info('error sending welcome message email', err));
  }
  public StartEmailSequence(sequence: string, user: Partial<IUser>) {
    if (!user.email) {
      throw new Error('No email provided');
    }
    // @TODO Add example of an email sequence implementation
    // Something like
    // 1 - Send first email of the sequence
    // 2 - Save the step of the sequence in database
    // 3 - Schedule job for second email in 1-3 days or whatever
    // Every sequence can have its own behavior so maybe
    // the pattern Chain of Responsibility can help here.
    return { delivered: 1, status: 'ok' };
  }
}
