'use strict';

import mongoose from 'mongoose';
import hash from 'bcrypt';
import encrypt from 'crypto';
import jsonWebToken from 'jsonwebtoken';

const HAS_ROUNDS = 16;
const TOKEN_SEED_LENGTH = 128;

const accountSchema = mongoose.Schema({
  passwordHash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },
  createdOn: {
    type: Date,
    default: () => new Date(),
  },
});

function pCreateToken() {
  this.tokenSeed = encrypt.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save()
    .then((account) => {
      return jsonWebToken.sign(
        { tokenSeed: account.tokenSeed },
        process.env.SOUND_CLOUD_SECRET,
      );
    });
}

accountSchema.methods.pCreateToken = pCreateToken;

const Account = mongoose.model('userAccount', accountSchema); 

Account.create = (email, username, password) => {
  return hash.hash(password, HAS_ROUNDS)
    .then((passwordHash) => {
      password = null; /* eslint-disable-line */
      const tokenSeed = encrypt.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
      return new Account({
        email,
        username,
        passwordHash,
        tokenSeed,
      }).save();
    });
};

export default Account;
