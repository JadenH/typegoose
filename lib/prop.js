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
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm9wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxtQ0FBcUM7QUFFckMsK0JBQW1EO0FBQ25ELG1DQUFxRztBQUNyRyxpQ0FBK0Y7QUE0RS9GLElBQU0sb0JBQW9CLEdBQUcsVUFBQyxPQUFzQztJQUNsRSxPQUFBLE9BQU8sQ0FBQyxTQUFTO1FBQ2pCLE9BQU8sQ0FBQyxTQUFTO1FBQ2pCLE9BQU8sQ0FBQyxJQUFJO1FBQ1osT0FBTyxDQUFDLEtBQUs7UUFDYixPQUFPLENBQUMsSUFBSTtRQUNaLE9BQU8sQ0FBQyxTQUFTO1FBQ2pCLE9BQU8sQ0FBQyxTQUFTO0FBTmpCLENBTWlCLENBQUM7QUFFcEIsSUFBTSxxQkFBcUIsR0FBRyxVQUFDLE9BQXNDO0lBQ25FLE9BQUEsT0FBTyxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxJQUFJO0FBQXRELENBQXNELENBQUM7QUFFekQsSUFBTSxvQkFBb0IsR0FBRyxVQUFDLE9BQXNDLElBQUssT0FBQSxPQUFPLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQTFCLENBQTBCLENBQUM7QUFFcEcsSUFBTSxRQUFRLEdBQUcsVUFBQyxVQUFlLEVBQUUsSUFBUyxFQUFFLE1BQVcsRUFBRSxHQUFRLEVBQUUsT0FBZTtJQUFmLHdCQUFBLEVBQUEsZUFBZTtJQUNsRixJQUFNLElBQUksR0FBVyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztJQUM3QyxJQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3BFLElBQUksY0FBYyxFQUFFO1FBQ2xCLElBQUksY0FBYyxDQUFDLEdBQUcsRUFBRTtZQUN0QixJQUFJLENBQUMsZUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNuQixlQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO2FBQ3JCO1lBQ0QsSUFBSSxDQUFDLGVBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDeEIsZUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzthQUMxQjtZQUNELGVBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQ2QsZUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUN0QixHQUFHLEVBQUUsY0FBYyxDQUFDLEdBQUcsRUFDdkIsT0FBTyxFQUFFLFVBQVUsR0FDcEIsQ0FBQztTQUNIO1FBRUQsSUFBSSxjQUFjLENBQUMsR0FBRyxFQUFFO1lBQ3RCLElBQUksQ0FBQyxlQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ25CLGVBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDckI7WUFDRCxJQUFJLENBQUMsZUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUN4QixlQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO2FBQzFCO1lBQ0QsZUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFDZCxlQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQ3RCLEdBQUcsRUFBRSxjQUFjLENBQUMsR0FBRyxFQUN2QixPQUFPLEVBQUUsVUFBVSxHQUNwQixDQUFDO1NBQ0g7UUFDRCxPQUFPO0tBQ1I7SUFFRCxJQUFJLE9BQU8sRUFBRTtRQUNYLG1CQUFXLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ3hCO1NBQU07UUFDTCxvQkFBWSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztLQUN6QjtJQUVELElBQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUM7SUFDM0IsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7UUFDM0IsYUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFDWixhQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQ3BCLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQ3BDLEdBQUcsS0FBQSxHQUNKLENBQUM7UUFDRixPQUFPO0tBQ1I7U0FBTSxJQUFJLEdBQUcsRUFBRTtRQUNkLGFBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQ1osYUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUNwQixJQUFJLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUNwQyxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksR0FDZCxDQUFDO1FBQ0YsT0FBTztLQUNSO0lBRUQsSUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQztJQUNyQyxJQUFJLFFBQVEsRUFBRTtRQUNaLGFBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQ2YsYUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUN2QixJQUFJLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUNwQyxHQUFHLEVBQUUsUUFBUSxDQUFDLElBQUksR0FDbkIsQ0FBQztRQUNGLE9BQU87S0FDUjtJQUVELElBQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUM7SUFDbkMsSUFBSSxPQUFPLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO1FBQzFDLGFBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQ1osYUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUNwQixJQUFJLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUNwQyxPQUFPLFNBQUEsR0FDUixDQUFDO1FBQ0YsT0FBTztLQUNSO0lBRUQsSUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQztJQUM3QyxJQUFJLFlBQVksSUFBSSxPQUFPLFlBQVksS0FBSyxRQUFRLEVBQUU7UUFDcEQsYUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFDZixhQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQ3ZCLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQ3BDLFlBQVksY0FBQSxHQUNiLENBQUM7UUFDRixPQUFPO0tBQ1I7SUFFRCxJQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO0lBQ25DLElBQUksVUFBVSxFQUFFO1FBQ2QsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDOUIsVUFBVSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBbkIsQ0FBbUIsQ0FBQyxDQUFDO1NBQy9FO0tBQ0Y7SUFFRCxJQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO0lBQ3ZDLElBQUksT0FBTyxZQUFZLEtBQUssU0FBUyxFQUFFO1FBQ3JDLGFBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQ1osYUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUNwQixNQUFNLEVBQUUsWUFBWSxHQUNyQixDQUFDO0tBQ0g7SUFHRCxJQUFJLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN2RCxNQUFNLElBQUksMkJBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDbkM7SUFFRCxJQUFJLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN2RCxNQUFNLElBQUksMkJBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDbkM7SUFHRCxJQUFJLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN4RCxNQUFNLElBQUksMkJBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDbkM7SUFFRCxJQUFNLFFBQVEsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQzVCLElBQU0sU0FBUyxHQUFHLGFBQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BELElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxtQkFBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN2RCxNQUFNLElBQUkseUJBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztLQUM1QztJQUVPLElBQUEscUJBQVUsRUFBRSx1QkFBWSxFQUFFLDhDQUFVLENBQWdCO0lBQzVELElBQUksbUJBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNyQixJQUFJLE9BQU8sRUFBRTtZQUNYLGFBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQ1osYUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNwQixPQUFPLElBQ1YsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQ2IsQ0FBQztZQUNGLE9BQU87U0FDUjtRQUNELGFBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQ1osYUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUNqQixPQUFPLElBQ1YsSUFBSSxFQUFFLElBQUksR0FDWCxDQUFDO1FBQ0YsT0FBTztLQUNSO0lBSUQsSUFBSSxnQkFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2hDLGFBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQ1osYUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUNqQixPQUFPLElBQ1YsSUFBSSxFQUFFLE1BQU0sR0FDYixDQUFDO1FBQ0YsT0FBTztLQUNSO0lBRUQsSUFBSSxPQUFPLEVBQUU7UUFDWCxhQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUNaLGFBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDcEIsT0FBTyxJQUNWLElBQUksRUFBRTs2QkFFQyxDQUFDLE9BQU8sT0FBTyxDQUFDLEdBQUcsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQ2hFLFNBQVM7YUFFZixHQUNGLENBQUM7UUFDRixPQUFPO0tBQ1I7SUFFRCxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0lBRS9CLElBQU0sa0JBQWtCLEdBQUcsVUFBVSxDQUFDLEdBQUcsS0FBSyxLQUFLLENBQUM7SUFDcEQsSUFBTSxhQUFhLEdBQUcsSUFBSSxNQUFNLGNBQU0sU0FBUyxHQUFJLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFN0YsSUFBTSxxQkFBcUIsR0FBRyxjQUFPLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakYsSUFBSSxxQkFBcUIsRUFBRTtRQUN6QixhQUFhLENBQUMsT0FBTyxHQUFHLHFCQUFxQixDQUFDO0tBQy9DO0lBRUQsYUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFDWixhQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQ2pCLE9BQU8sSUFDVixJQUFJLEVBQUUsYUFBYSxHQUNwQixDQUFDO0lBQ0YsT0FBTztBQUNULENBQUMsQ0FBQztBQUVXLFFBQUEsSUFBSSxHQUFHLFVBQUMsT0FBcUM7SUFBckMsd0JBQUEsRUFBQSxZQUFxQztJQUFLLE9BQUEsVUFBQyxNQUFXLEVBQUUsR0FBVztRQUN0RixJQUFNLElBQUksR0FBSSxPQUFlLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFdEUsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNULE1BQU0sSUFBSSx3QkFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2hDO1FBRUQsUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7QUFSOEQsQ0FROUQsQ0FBQztBQVFXLFFBQUEsU0FBUyxHQUFHLFVBQUMsT0FBeUIsSUFBSyxPQUFBLFVBQUMsTUFBVyxFQUFFLEdBQVc7SUFDL0UsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUMzQixRQUFRLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzdDLENBQUMsRUFIdUQsQ0FHdkQsQ0FBQyJ9