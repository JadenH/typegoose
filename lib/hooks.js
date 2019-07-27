"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("./data");
var hooks = {
    pre: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return function (constructor) {
            addToHooks(constructor.name, 'pre', args);
        };
    },
    post: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return function (constructor) {
            addToHooks(constructor.name, 'post', args);
        };
    },
};
var addToHooks = function (name, hookType, args) {
    if (!data_1.hooks[name]) {
        data_1.hooks[name] = { pre: [], post: [] };
    }
    data_1.hooks[name][hookType].push(args);
};
exports.pre = hooks.pre;
exports.post = hooks.post;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaG9va3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSwrQkFBNEM7QUFnRTVDLElBQU0sS0FBSyxHQUFVO0lBQ25CLEdBQUc7UUFBQyxjQUFPO2FBQVAsVUFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTztZQUFQLHlCQUFPOztRQUNULE9BQU8sVUFBQyxXQUFnQjtZQUN0QixVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUNELElBQUk7UUFBQyxjQUFPO2FBQVAsVUFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTztZQUFQLHlCQUFPOztRQUNWLE9BQU8sVUFBQyxXQUFnQjtZQUN0QixVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUM7QUFFRixJQUFNLFVBQVUsR0FBRyxVQUFDLElBQUksRUFBRSxRQUF3QixFQUFFLElBQUk7SUFDdEQsSUFBSSxDQUFDLFlBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNwQixZQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQztLQUN6QztJQUNELFlBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkMsQ0FBQyxDQUFDO0FBRVcsUUFBQSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztBQUNoQixRQUFBLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDIn0=