import { Router } from 'express';
import AuthController from '../controllers/auth';
//import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);
  route.post(
    '/signup',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phoneNumber: Joi.number().required(),
        password: Joi.string().required(),
      }),
    }),
    AuthController.createUser,
  );

  route.post(
    '/signin',
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    AuthController.loginUser,
  );

  /**
   * @TODO Let's leave this as a place holder for now
   * The reason for a logout route could be deleting a 'push notification token'
   * so the device stops receiving push notifications after logout.
   *
   * Another use case for advance/enterprise apps, you can store a record of the jwt token
   * emitted for the session and add it to a black list.
   * It's really annoying to develop that but if you had to, please use Redis as your data store
   */
  // route.post('/logout', middlewares.isAuth, (req: Request, res: Response, next: NextFunction) => {
  //   //   const logger = Container.get('logger');
  //   //   logger.debug('Calling Sign-Out endpoint with body: %o', req.body);
  //   //   try {
  //   //     //@TODO AuthService.Logout(req.user) do some clever stuff
  //   //     return res.status(200).end();
  //   //   } catch (e) {
  //   //     logger.error('🔥 error %o', e);
  //   //     return next(e);
  //   //   }
  // });
};
