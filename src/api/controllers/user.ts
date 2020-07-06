import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import UserService from '../../services/user';
import { IUserInput } from '../../interfaces/IUser';
import { IVendorInput } from '../../interfaces/IVendor';

const UserController = {
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
  async getUser(req: Request, res: Response, next: NextFunction) {
    const logger = Container.get('logger');
    logger.debug(`Calling Get-User endpoint with Id`);
    try {
      const userServiceInstance = Container.get(UserService);
      const user = await userServiceInstance.getUserById(req.params.id);
      if (!user) {
        throw new Error('Usr not found');
      }
      return res.status(201).json({ user });
    } catch (error) {
      logger.error(`🔥 error: ${error}`);
      return next(error);
    }
  },

  async updateUser(req: Request, res: Response, next: NextFunction) {
    const logger = Container.get('logger');
    logger.debug(`Calling Get-User endpoint with Id`);
    try {
      const userServiceInstance = Container.get(UserService);
      const user = await userServiceInstance.updateUserById(req.params.id, req.body);
      return res.status(201).json({ user });
    } catch (error) {
      logger.error(`⚠️ error: ${error}`);
      return next(error);
    }
  },
};

export default UserController;
