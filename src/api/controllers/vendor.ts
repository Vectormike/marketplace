import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import VendorService from '../../services/vendor';
import { IVendorInput } from '../../interfaces/IVendor';

const VendorController = {
  async createVendor(req: Request, res: Response, next: NextFunction) {
    const logger = Container.get('logger');
    logger.debug(`Calling Sign-Up endpoint with body`);
    try {
      const vendorServiceInstance = Container.get(VendorService);
      const { vendor, token } = await vendorServiceInstance.createVendor(req.body as IVendorInput);
      return res.status(201).json({ vendor, token });
    } catch (error) {
      logger.error(`⚠️ error: ${error}`);
      return next(error);
    }
  },
  async getVendor(req: Request, res: Response, next: NextFunction) {
    const logger = Container.get('logger');
    logger.debug(`Calling Get-User endpoint with Id`);
    try {
      const vendorServiceInstance = Container.get(VendorService);
      const vendor = await vendorServiceInstance.getVendorById(req.params.id);
      if (!vendor) {
        throw new Error('Usr not found');
      }
      return res.status(201).json({ vendor });
    } catch (error) {
      logger.error(`🔥 error: ${error}`);
      return next(error);
    }
  },

  async updateVendor(req: Request, res: Response, next: NextFunction) {
    const logger = Container.get('logger');
    logger.debug(`Calling Get-User endpoint with Id`);
    try {
      const vendorServiceInstance = Container.get(VendorService);
      const vendor = await vendorServiceInstance.updateVendorById(req.params.id, req.body);
      return res.status(201).json({ vendor });
    } catch (error) {
      logger.error(`⚠️ error: ${error}`);
      return next(error);
    }
  },
};

export default VendorController;
