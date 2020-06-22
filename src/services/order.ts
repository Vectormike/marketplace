import { Service, Inject } from 'typedi';
import MailerService from './emails/mailer';
import config from '../config';
import { randomBytes } from 'crypto';
import { IOrder } from '../interfaces/IOrder';

@Service()
export default class OrderService {
  constructor(
    @Inject('orderModel') private orderModel: Models.OrderModel,
    private mailer: MailerService,
    @Inject('logger') private logger,
  ) {}

  /**
   * Returns all orders if token is verified
   * @public
   */
  public async viewAllOrder(): Promise<{ order: object }> {
    try {
      this.logger.silly('Find all orders');
      const order = await this.orderModel
        .find()
        .sort({ createdAt: -1 })
        .exec();
      if (!order) {
        throw new Error('No order');
      }
      return { order };
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  public async makeOrder(name: string, address: string, user: string): Promise<{ order: object }> {
    const orderId = randomBytes(2);
    try {
      this.logger.silly('Making order');
      const newOrder = new this.orderModel({
        user,
        orderId,
        name,
        address,
      });
      this.logger.silly('Saving order to DB');
      const order = await newOrder.save();

      if (!order) {
        throw new Error('Unable to make your order');
      }
      return { order };
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }
}
