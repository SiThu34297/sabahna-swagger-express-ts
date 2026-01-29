'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.docsJson = exports.express = void 0;
var express_1 = require('express');
var swagger_service_1 = require('./swagger.service');
var assert = require('assert');
var swagger_builder_1 = require('./swagger.builder');
function express(options) {
    var path = '/api-docs/swagger.json';
    if (options) {
        assert.ok(options.definition, 'Definition is required.');
        if (options.path) {
            path = options.path;
        }
        if (options.definition) {
            (0, swagger_builder_1.build)(options.definition);
        }
    }
    var router = buildRouter(path);
    return router;
}
exports.express = express;
function docsJson(options) {
    assert.ok(options, 'Definition is required.');
    var swaggerDocs =
        swagger_service_1.SwaggerService.getInstance().getDefinition(
            options,
        );

    if (swaggerDocs.openapi) {
        delete swaggerDocs.swagger;
    }

    return swaggerDocs;
}
exports.docsJson = docsJson;
function buildRouter(path) {
    var router = (0, express_1.Router)();
    router.get(path, function (request, response, next) {
        // const data: ISwagger = SwaggerService.getInstance().getDefinition(
        //     request.params.portal
        // );
        response.json('Hello');
    });
    return router;
}
//# sourceMappingURL=express.configurator.js.map
