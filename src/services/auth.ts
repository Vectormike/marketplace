import { Service, Inject, Container } from 'typedi';
import jwt from 'jsonwebtoken';
import MailerService from './emails/mailer';
import UserService from '../services/user';
import VendorService from '../services/vendor';
import config from '../config';
import argon2 from 'argon2';
import { IUser } from '../interfaces/IUser';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import { IVendor } from '../interfaces/IVendor';

@Service()
export default class AuthService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('vendorModel') private vendorModel: Models.VendorModel,
    private mailer: MailerService,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  /**
   * Returns jwt token if valid username and password is provided
   * @public
   */
  public async loginUserWithEmailAndPassword(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const userServiceInstance = Container.get(UserService);
    const userRecord = await userServiceInstance.getUserByEmail(email);
    if (!userRecord) {
      throw new Error('User not registered');
    }
    this.logger.silly('Checking password');
    const validPassword = await argon2.verify(userRecord.password, password);
    if (validPassword) {
      this.logger.silly('Password is valid!');
      this.logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);
      const user = userRecord.toObject();
      return { user, token };
    } else {
      throw new Error('Invalid Password');
    }
  }

  public async loginVendorWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<{ vendor: IVendor; token: string }> {
    this.logger.debug(`${email}`);
    const vendorServiceInstance = Container.get(VendorService);
    const vendorRecord = await vendorServiceInstance.getVendorByEmail(email);

    if (!vendorRecord) {
      throw new Error('Vendor not registered');
    }
    this.logger.silly('Checking password');
    const validPassword = await argon2.verify(vendorRecord.password, password);
    if (validPassword) {
      this.logger.silly('Password is valid!');
      this.logger.silly('Generating JWT');
      const token = this.generateToken(vendorRecord);
      const vendor = vendorRecord.toObject();
      return { vendor, token };
    } else {
      throw new Error('Invalid Password');
    }
  }

  /**
   * Reset password
   * @param {string} resetPasswordToken
   * @param {string} newPassword
   * @returns {Promise}
   */
  public async sendUserPasswordReset(email: string): Promise<{ user: IUser; token: string }> {
    try {
    } catch (error) {}
  }

  private generateToken(user) {
    const today = new Date();
    const exp = new Date(today);
    const tokenType = 'Bearer';
    exp.setDate(today.getDate() + 60);
    this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        _id: user._id,
        role: user.role,
        name: user.name,
        tokenType,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret,
    );
  }
}
