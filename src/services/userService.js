import { User } from "../db/models/user.js";
import { Session } from "../db/models/session.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

import jwt from 'jsonwebtoken';

import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';


import { TEMPLATES_DIR } from '../constants/index.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

export async function registerUser(payload){
   const user = await User.findOne({email: payload.email});
   if (user != null){
    throw createHttpError(409, "Email is already in use");
   }

   const emailName = payload.email.split('@')[0];
   payload.name = emailName;


   payload.password = await bcrypt.hash(payload.password, 10);

   return User.create(payload);
};


export async function loginUser(email, password) {
   const user = await User.findOne({ email });

   if (user === null) {
     throw createHttpError(404, 'User not found');
   }

   const isMatch = await bcrypt.compare(password, user.password);

   if (isMatch !== true) {
     throw createHttpError(401, 'Email or password is incorrect');
   }

   await Session.deleteOne({userId: user._id});

   const accessToken = crypto.randomBytes(30).toString('base64');
   const refreshToken = crypto.randomBytes(30).toString('base64');

   const session = await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 2 * 60 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return {
      user,
      session,
    };
}


export async function getUser(userId) {

  const user = await User.findById(userId);

  return user;
}

export async function getNumberOsUsers() {

  const number = await User.countDocuments();

  return number;
}

export const patchUser = async (id, payload, options = {}) => {
  const rawResult = await User.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
      upsert: false,
      ...options,
    },
  );

  if (!rawResult) return null;

  return {
    user: rawResult,
    isNew: !rawResult.createdAt || rawResult.createdAt === rawResult.updatedAt,
  };
};

// export async function logoutUser(sessionId) {
//   await Session.deleteOne({ _id: sessionId });
// }

export async function logoutUser2point0(id) {
  await Session.deleteMany({ userId: id });
}


export async function refreshSession(sessionId, refreshToken){
  const session = await Session.findById(sessionId);

  if (session === null) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw createHttpError(401, 'Session not found1');
  }

  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token is expired');
  }

  await Session.deleteOne({ _id: session._id });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}

export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `https://${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await User.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
