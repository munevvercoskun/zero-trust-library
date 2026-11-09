//connection pool:
//one shared pool of database connections, built from my config.

import {config} from './config.js';
import pg from 'pg';

export const pool = new pg.Pool({ ...config.db, max: 10 })
