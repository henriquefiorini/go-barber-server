import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import ProviderController from './app/controllers/ProviderController';
import AvailableController from './app/controllers/AvailableController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import FileController from './app/controllers/FileController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.create);

routes.post('/users', UserController.create);
routes.put('/users', authMiddleware, UserController.update);

routes.get('/providers', authMiddleware, ProviderController.list);
routes.get(
  '/providers/:providerId/available',
  authMiddleware,
  AvailableController.list
);

routes.get('/appointments', authMiddleware, AppointmentController.list);
routes.post('/appointments', authMiddleware, AppointmentController.create);
routes.delete(
  '/appointments/:id',
  authMiddleware,
  AppointmentController.delete
);

routes.get('/schedule', authMiddleware, ScheduleController.list);

routes.get('/notifications', authMiddleware, NotificationController.list);
routes.put('/notifications/:id', authMiddleware, NotificationController.update);

routes.post(
  '/files',
  authMiddleware,
  upload.single('file'),
  FileController.create
);

export default routes;
