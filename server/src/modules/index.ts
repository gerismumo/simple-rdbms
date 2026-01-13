import { Router } from 'express';

export default function modules() {
  const router = Router();
  // router.use('/auth',authModule());
  // router.use('/users', usersModule());
  
  return router;
}
