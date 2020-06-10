import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import AuthService from '../../services/auth';
import { IUserInput } from '../../interfaces/IUser';

const AuthController = {
  async registerUser(req: Request, res: Response, next: NextFunction) {
    const logger = Container.get('logger');
    logger.debug(`Calling Sign-Up endpoint with body: ${req.body}`);
    try {
      const authServiceInstance = Container.get(AuthService);
      const { user, token } = await authServiceInstance.SignUp(req.body as IUserInput);
      return res.status(201).json({ user, token });
    } catch (error) {
      logger.error(`🔥 error: ${error}`);
      return next(error);
    }
  },

  async loginUser(req: Request, res: Response, next: NextFunction) {
    const logger = Container.get('logger');
    logger.debug(`Calling Sign-In endpoint with body: ${req.body}`);
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
