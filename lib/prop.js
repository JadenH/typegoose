"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var data_1 = require("./data");
var errors_1 = require("./errors");
var utils_1 = require("./utils");
var isWithStringValidate = function (options) {
    return options.lowercase ||
        options.uppercase ||
        options.trim ||
        options.match ||
        options.enum ||
        options.minlength ||
        options.maxlength;
};
var isWithStringTransform = function (options) {
    return options.lowercase || options.uppercase || options.trim;
};
var isWithNumberValidate = function (options) { return options.min || options.max; };
var baseProp = function (rawOptions, Type, target, key, isArray) {
    if (isArray === void 0) { isArray = false; }
    var name = target.constructor.name;
    var isGetterSetter = Object.getOwnPropertyDescriptor(target, key);
    if (isGetterSetter) {
        if (isGetterSetter.get) {
            if (!data_1.virtuals[name]) {
                data_1.virtuals[name] = {};
            }
            if (!data_1.virtuals[name][key]) {
                data_1.virtuals[name][key] = {};
            }
            data_1.virtuals[name][key] = __assign({}, data_1.virtuals[name][key], { get: isGetterSetter.get, options: rawOptions });
        }
        if (isGetterSetter.set) {
            if (!data_1.virtuals[name]) {
                data_1.virtuals[name] = {};
            }
            if (!data_1.virtuals[name][key]) {
                data_1.virtuals[name][key] = {};
            }
            data_1.virtuals[name][key] = __assign({}, data_1.virtuals[name][key], { set: isGetterSetter.set, options: rawOptions });
        }
        return;
    }
    if (isArray) {
        utils_1.initAsArray(name, key);
    }
    else {
        utils_1.initAsObject(name, key);
    }
    var ref = rawOptions.ref;
    if (typeof ref === 'string') {
        data_1.schema[name][key] = __assign({}, data_1.schema[name][key], { type: mongoose.Schema.Types.ObjectId, ref: ref });
        return;
    }
    else if (ref) {
        data_1.schema[name][key] = __assign({}, data_1.schema[name][key], { type: mongoose.Schema.Types.ObjectId, ref: ref.name });
        return;
    }
    var itemsRef = rawOptions.itemsRef;
    if (itemsRef) {
        data_1.schema[name][key][0] = __assign({}, data_1.schema[name][key][0], { type: mongoose.Schema.Types.ObjectId, ref: itemsRef.name });
        return;
    }
    var refPath = rawOptions.refPath;
    if (refPath && typeof refPath === 'string') {
        data_1.schema[name][key] = __assign({}, data_1.schema[name][key], { type: mongoose.Schema.Types.ObjectId, refPath: refPath });
        return;
    }
    var itemsRefPath = rawOptions.itemsRefPath;
    if (itemsRefPath && typeof itemsRefPath === 'string') {
        data_1.schema[name][key][0] = __assign({}, data_1.schema[name][key][0], { type: mongoose.Schema.Types.ObjectId, itemsRefPath: itemsRefPath });
        return;
    }
    var enumOption = rawOptions.enum;
    if (enumOption) {
        if (!Array.isArray(enumOption)) {
            rawOptions.enum = Object.keys(enumOption).map(function (propKey) { return enumOption[propKey]; });
        }
    }
    var selectOption = rawOptions.select;
    if (typeof selectOption === 'boolean') {
        data_1.schema[name][key] = __assign({}, data_1.schema[name][key], { select: selectOption });
    }
    if (isWithStringValidate(rawOptions) && !utils_1.isString(Type)) {
        throw new errors_1.NotStringTypeError(key);
    }
    if (isWithNumberValidate(rawOptions) && !utils_1.isNumber(Type)) {
        throw new errors_1.NotNumberTypeError(key);
    }
    if (isWithStringTransform(rawOptions) && !utils_1.isString(Type)) {
        throw new errors_1.NotStringTypeError(key);
    }
    var instance = new Type();
    var subSchema = data_1.schema[instance.constructor.name];
    if (!subSchema && !utils_1.isPrimitive(Type) && !utils_1.isObject(Type)) {
        throw new errors_1.InvalidPropError(Type.name, key);
    }
    var r = rawOptions["ref"], i = rawOptions["items"], options = __rest(rawOptions, ['ref', 'items']);
    if (utils_1.isPrimitive(Type)) {
        if (isArray) {
            data_1.schema[name][key] = __assign({}, data_1.schema[name][key][0], options, { type: [Type] });
            return;
        }
        data_1.schema[name][key] = __assign({}, data_1.schema[name][key], options, { type: Type });
        return;
    }
    if (utils_1.isObject(Type) && !subSchema) {
        data_1.schema[name][key] = __assign({}, data_1.schema[name][key], options, { type: Object });
        return;
    }
    if (isArray) {
        data_1.schema[name][key] = __assign({}, data_1.schema[name][key][0], options, { type: [
                __assign({}, (typeof options._id !== 'undefined' ? { _id: options._id } : {}), subSchema),
            ] });
        return;
    }
    var Schema = mongoose.Schema;
    var supressSubschemaId = rawOptions._id === false;
    var virtualSchema = new Schema(__assign({}, subSchema), supressSubschemaId ? { _id: false } : {});
    var schemaInstanceMethods = data_1.methods.instanceMethods[instance.constructor.name];
    if (schemaInstanceMethods) {
        virtualSchema.methods = schemaInstanceMethods;
    }
    data_1.schema[name][key] = __assign({}, data_1.schema[name][key], options, { type: virtualSchema });
    return;
};
exports.prop = function (options) {
    if (options === void 0) { options = {}; }
    return function (target, key) {
        var Type = Reflect.getMetadata('design:type', target, key);
        if (!Type) {
            throw new errors_1.NoMetadataError(key);
        }
        baseProp(options, Type, target, key);
    };
};
exports.arrayProp = function (options) { return function (target, key) {
    var Type = options.items;
    baseProp(options, Type, target, key, true);
}; };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm9wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLG1DQUFxQztBQUVyQywrQkFBbUQ7QUFDbkQsbUNBQXFHO0FBQ3JHLGlDQUErRjtBQTRFL0YsSUFBTSxvQkFBb0IsR0FBRyxVQUFDLE9BQXNDO0lBQ2xFLE9BQUEsT0FBTyxDQUFDLFNBQVM7UUFDakIsT0FBTyxDQUFDLFNBQVM7UUFDakIsT0FBTyxDQUFDLElBQUk7UUFDWixPQUFPLENBQUMsS0FBSztRQUNiLE9BQU8sQ0FBQyxJQUFJO1FBQ1osT0FBTyxDQUFDLFNBQVM7UUFDakIsT0FBTyxDQUFDLFNBQVM7QUFOakIsQ0FNaUIsQ0FBQztBQUVwQixJQUFNLHFCQUFxQixHQUFHLFVBQUMsT0FBc0M7SUFDbkUsT0FBQSxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLElBQUk7QUFBdEQsQ0FBc0QsQ0FBQztBQUV6RCxJQUFNLG9CQUFvQixHQUFHLFVBQUMsT0FBc0MsSUFBSyxPQUFBLE9BQU8sQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBMUIsQ0FBMEIsQ0FBQztBQUVwRyxJQUFNLFFBQVEsR0FBRyxVQUFDLFVBQWUsRUFBRSxJQUFTLEVBQUUsTUFBVyxFQUFFLEdBQVEsRUFBRSxPQUFlO0lBQWYsd0JBQUEsRUFBQSxlQUFlO0lBQ2xGLElBQU0sSUFBSSxHQUFXLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO0lBQzdDLElBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDcEUsSUFBSSxjQUFjLEVBQUU7UUFDbEIsSUFBSSxjQUFjLENBQUMsR0FBRyxFQUFFO1lBQ3RCLElBQUksQ0FBQyxlQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ25CLGVB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