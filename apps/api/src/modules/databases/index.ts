import { Router } from 'express';
import databasesRoutes from './databases.routes';
import { DatabaseServiceState } from '../../shared/types/database';


export default function databasesModule(state: DatabaseServiceState):Router {
  const router = Router();
  router.use(databasesRoutes(state));
  return router;
}