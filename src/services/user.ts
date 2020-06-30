import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import MailerService from './emails/mailer';
import config from '../config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IUser, IUserInput } from '../interfaces/IUser';
import { IVendor, IVendorInput } from '../interfaces/IVendor';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import events from '../subscribers/events';

@Service()
export default class UserService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('vendorModel') private vendorModel: Models.VendorModel,
    private mailer: MailerService,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  /**
   * Returns jwt token if registration was successful
   * @public
   */
  public async createUser(userInput: IUserInput): Promise<{ user: IUser; token: string }> {
    try {
      const salt = randomBytes(32);
      this.logger.silly('Hashing password');
      const hashedPassword = await argon2.hash(userInput.password, { salt });
      this.logger.silly('Creating user db record');
      const userRecord = await this.userModel.create({
        ...userInput,
        salt: salt.toString('hex'),
        password: hashedPassword,
      });
      this.logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);

      if (!userRecord) {
        throw new Error('User cannot be created');
      }
      this.logger.silly('Sending welcome email');
      await this.mailer.sendWelcomeEmail(userRecord);
      this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord });
      const user = userRecord.toObject();
      return { user, token };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  // /**
  //  * Query for users
  //  * @param {Object} filter - Mongo filter
  //  * @param {Object} options - Query options
  //  * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
  //  * @param {number} [options.limit] - Maximum number of results per page (default = 10)
  //  * @param {number} [options.page] - Current page (default = 1)
  //  * @returns {Promise<QueryResult>}
  //  */
  // public async queryUsers(filter, options) {
  //   const users = await this.userModel.paginate(filter, options);
  //   return users;
  // }

  /**
   * Get user by id
   * @param {ObjectId} id
   * @returns {Promise<User>}
   */
  public async getUserById(id: string) {
    try {
      return this.userModel.findById(id);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  /**
   * Get user by email
   * @param {ObjectId} id
   * @returns {Promise<User>}
   */
  public async getUserByEmail(email: string) {
    try {
      return this.userModel.findOne({ email });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  /**
   * Get user by id
   * @param {ObjectId} id
   * @returns {Promise<User>}
   */

  public async updateUserById(id: string, updateBody): Promise<{ user: IUser }> {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, updateBody, {
        new: true,
      });
      if (!user) {
        throw new Error('User not found');
      }
      return { user };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
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
