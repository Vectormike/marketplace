import { Service, Inject } from 'typedi';
import MailerService from './emails/mailer';
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
  public async viewAllOrder(): Promise<{ order }> {
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

  public async makeOrder(name: string, address: string, cart, user: string): Promise<{ order: IOrder }> {
    const orderId = randomBytes(2);
    try {
      this.logger.silly('Making order');
      const newOrder = new this.orderModel({
        user,
        orderId,
        createdDate: new Date(),
        cart,
        name,
        address,
        paid: true,
      });
      this.logger.silly('Saving order to DB');
      const order = await newOrder.save();

      this.logger.silly('Sending email to user');
      await this.mailer.SendOrderEmail(user);

      if (!order) {
        throw new Error('Unable to make your order');
      }
      return { order };
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  public async deleteOrder(id: string) {
    try {
      this.logger.silly('Getting order ID');
      const result = await this.orderModel.findByIdAndRemove({ id }).exec();
      if (!result) {
        throw new Error('Unable to delete');
      }
      return { message: 'Deleted!' };
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }
}
