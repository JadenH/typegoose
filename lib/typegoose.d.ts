import * as mongoose from 'mongoose';
import 'reflect-metadata';
export * from './method';
export * from './prop';
export * from './hooks';
export * from './plugin';
export * from './options';
export * from '.';
export { getClassForDocument } from './utils';
export declare type InstanceType<T> = T & mongoose.Document;
export declare type ModelType<T> = mongoose.Model<InstanceType<T>> & T;
export interface GetModelForClassOptions {
    existingMongoose?: mongoose.Mongoose;
    schemaOptions?: mongoose.SchemaOptions;
    existingConnection?: mongoose.Connection;
}
export declare class Typegoose {
    getModelForClass<T>(t: T, { existingMongoose, schemaOptions, existingConnection }?: GetModelForClassOptions): any;
    setModelForClass<T>(t: T, { existingMongoose, schemaOptions, existingConnection }?: GetModelForClassOptions): any;
    private buildSchema;
}
