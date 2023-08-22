"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiModelProperty = void 0;
var swagger_service_1 = require("./swagger.service");
function ApiModelProperty(args) {
    return function (target, propertyKey) {
        var propertyType = '';
        if (args) {
            if (typeof args.itemType !== 'undefined' &&
                args.itemType !== null) {
                propertyType = args.itemType;
            }
            else {
                try {
                    propertyType = Reflect.getMetadata('design:type', target, propertyKey).name;
                }
                catch (err) {
                    if (err.message ===
                        "Cannot read property 'name' of undefined") {
                        throw new Error("".concat(err.message, ". This usually occours due to a circular reference between models. A possible solution is to set the itemType argument of the @ApiModelProperty to a string that matches the class name of the field type. The field in question is named ").concat(String(propertyKey), "."));
                    }
                    else {
                        throw err;
                    }
                }
            }
            swagger_service_1.SwaggerService.getInstance().addApiModelProperty(args, target, propertyKey, propertyType);
        }
    };
}
exports.ApiModelProperty = ApiModelProperty;
//# sourceMappingURL=api-model-property.decorator.js.map