import { Router } from 'express';
import AuthController from '../controllers/auth';
//import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);
  route.post(
    '/signup/user',
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
    '/signup/vendor',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phoneNumber: Joi.number().required(),
        password: Joi.string().required(),
      }),
    }),
    AuthController.createVendor,
  );

  route.post(
    '/signin/user',
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    AuthController.loginUser,
  );

  route.post(
    '/signin/vendor',
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    AuthController.loginVendor,
  );
};
