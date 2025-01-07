import {dirname} from 'path';
import { fileURLToPath } from 'url';
import { pbkdf2 } from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

const currentDir = dirname(dirname(fileURLToPath(import.meta.url)));
export {currentDir};

const pbkdf2Promisified = promisify(pbkdf2);
export {pbkdf2Promisified};

const singPromisified = promisify(jwt.sign);
export {singPromisified};

const verifyPromisified = promisify(jwt.verify);
export {verifyPromisified};