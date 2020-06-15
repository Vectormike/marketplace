import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import MailerService from './mailer';
import config from '../config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IVendor, IVendorInput } from '../interfaces/IVendor';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import events from '../subscribers/events';
import { errors } from 'celebrate';

@Service()
export default class VendorService {
  constructor(
    @Inject('vendorModel') private vendorModel: Models.VendorModel,
    private mailer: MailerService,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async SignUpVendor(vendorInput: IVendorInput): Promise<{ vendor: IVendor; token: string }> {
    try {
      const salt = randomBytes(32);
      this.logger.silly('Hashing Password');
      const hashedPassword = await argon2.hash(vendorInput.password, { salt });
      this.logger.silly(`Creating Vendor's records`);
      const vendorRecord = await this.vendorModel.create({
        ...vendorInput,
        hashedPassword,
      });
      this.logger.silly(`Generating JWT`);
      const token = this.generateToken(vendorRecord);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private generateToken(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    /**
     * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
     * The cool thing is that you can add custom properties a.k.a metadata
     * Here we are adding the userId, role and name
     * Beware that the metadata is public and can be decoded without _the secret_
     * but the client cannot craft a JWT to fake a userId
     * because it doesn't have _the secret_ to sign it
     * more information here: https://softwareontheroad.com/you-dont-need-passport
     */
    this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        _id: user._id, // We are gonna use this in the middleware 'isAuth'
        role: user.role,
        name: user.name,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret,
    );
  }
}
