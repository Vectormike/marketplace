import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import AuthService from '../../services/user';
import { IUserInput } from '../../interfaces/IUser';
import { create } from 'lodash';

const AuthController = {
  async createUser(req: Request, res: Response, next: NextFunction) {
    const logger = Container.get('logger');
    logger.debug(`Calling Sign-Up endpoint with body`);
    try {
      const authServiceInstance = Container.get(AuthService);
      const { user, token } = await authServiceInstance.createUser(req.body as IUserInput);
      return res.status(201).json({ user, token });
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
      const { user, token } = await authServiceInstance.SignIn(email, password);
      return res.status(200).json({ user, token });
    } catch (error) {
      logger.error(`🔥 error: ${error}`);
      return next(error);
    }
  },
};

export default AuthController;
