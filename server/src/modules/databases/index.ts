import { Router } from 'express';
import databasesRoutes from './databases.routes';
import { DatabaseServiceState } from './types';

export default function databasesModule(state: DatabaseServiceState) {
  const router = Router();
  router.use(databasesRoutes(state));
  return router;
}