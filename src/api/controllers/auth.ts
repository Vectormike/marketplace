import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import UserService from '../../services/user';
import VendorService from '../../services/vendor';
import AuthService from '../../services/auth';
import { IUserInput } from '../../interfaces/IUser';
import { IVendorInput } from '../../interfaces/IVendor';

const AuthController = {
  async createUser(req: Request, res: Response, next: NextFunction) {
    const logger = Container.get('logger');
    logger.debug(`Calling Sign-Up endpoint with body`);
    try {
      const userServiceInstance = Container.get(UserService);
      const { user, token } = await userServiceInstance.createUser(req.body as IUserInput);
      return res.status(201).json({ user, token });
    } catch (error) {
      logger.error(`🔥 error: ${error}`);
      return next(error);
    }
  },

  async createVendor(req: Request, res: Response, next: NextFunction) {
    const logger = Container.get('logger');
    logger.debug(`Calling Sign-Up endpoint with body`);
    try {
      const vendorServiceInstance = Container.get(VendorService);
      const { vendor, token } = await vendorServiceInstance.createVendor(req.body as IVendorInput);
      return res.status(201).json({ vendor, token });
    } catch (error) {
      logger.error(`🔥 error: ${error}`);
      return next(error);
    }
  },

  async loginUser(req: Request, res: Response, next: NextFunction) {
    const logger = Container.get('logger');
    logger.debug(`Calling Sign-In endpoint with body`);
    try {
      const { email, password } = req.body;
      const authServiceInstance = Container.get(AuthService);
      const { user, token } = await authServiceInstance.loginUserWithEmailAndPassword(email, password);
      return res.status(200).json({ user, token });
    } catch (error) {
      logger.error(`🔥 error: ${error}`);
      return next(error);
    }
  },

  async loginVendor(req: Request, res: Response, next: NextFunction) {
    const logger = Container.get('logger');
    logger.debug(`Calling Sign-In endpoint with body`);
    try {
      const { email, password } = req.body;
      const authServiceInstance = Container.get(AuthService);
      const { user, token } = await authServiceInstance.loginVendorWithEmailAndPassword(email, password);
      return res.status(200).json({ user, token });
    } catch (error) {
      logger.error(`🔥 error: ${error}`);
      return next(error);
    }
  },
};

export default AuthController;
