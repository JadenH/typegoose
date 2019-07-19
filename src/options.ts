/** @format */
import * as mongoose from 'mongoose';

import { schemaOptions } from './data';

export const options = (opts: mongoose.SchemaOptions) => (constructor: any) => {
  const name: string = constructor.name;
  if (!schemaOptions[name]) {
    schemaOptions[name] = {};
  }
  schemaOptions[name] = opts;
};
