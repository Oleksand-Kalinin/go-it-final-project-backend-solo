import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerController,
  loginController,
  logoutController2point0,
  refreshController,
  requestResetEmailController,
  infoController,
  resetPasswordController,
  patchUserController,
  totalNumberUsers
} from '../controllers/userController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/user.js';

import { requestResetEmailSchema } from '../validation/user.js';

import { resetPasswordSchema } from '../validation/user.js';
import { updateUserSchema } from '../validation/user.js';

import { auth } from '../middlewares/auth.js';

import { upload } from '../middlewares/multer.js';

const userRouter = express.Router();
const jsonParser = express.json();

userRouter.post(
  '/register',
  jsonParser,
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

userRouter.post(
  '/login',
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(loginController),
);

userRouter.get(
  '/info',
  auth,
  ctrlWrapper(infoController),
);

userRouter.get(
  '/participants',

  ctrlWrapper(totalNumberUsers),
);

userRouter.patch(
  '/',
  auth,
  jsonParser,
  upload.single('photo'),
  validateBody(updateUserSchema),
  ctrlWrapper(patchUserController),
);

// userRouter.post(
//   '/logout',
//   auth,
//   ctrlWrapper(logoutController),
// );

userRouter.post(
  '/logout',
  auth,
  ctrlWrapper(logoutController2point0),
);

userRouter.post(
  '/refresh',
  ctrlWrapper(refreshController),
);

userRouter.post(
  '/send-reset-email',
  jsonParser,
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

userRouter.post(
  '/reset-pwd',
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default userRouter;
