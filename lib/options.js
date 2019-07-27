"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("./data");
exports.options = function (opts) { return function (constructor) {
    var name = constructor.name;
    if (!data_1.schemaOptions[name]) {
        data_1.schemaOptions[name] = {};
    }
    data_1.schemaOptions[name] = opts;
}; };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9vcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsK0JBQXVDO0FBRTFCLFFBQUEsT0FBTyxHQUFHLFVBQUMsSUFBNEIsSUFBSyxPQUFBLFVBQUMsV0FBZ0I7SUFDeEUsSUFBTSxJQUFJLEdBQVcsV0FBVyxDQUFDLElBQUksQ0FBQztJQUN0QyxJQUFJLENBQUMsb0JBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN4QixvQkFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUMxQjtJQUNELG9CQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzdCLENBQUMsRUFOd0QsQ0FNeEQsQ0FBQyJ9