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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerService = void 0;
var assert = require("assert");
var _ = require("lodash");
var swagger_definition_constant_1 = require("./swagger-definition.constant");
var swagger_builder_1 = require("./swagger.builder");
var SwaggerService = /** @class */ (function () {
    function SwaggerService() {
        this.controllerMap = {};
        this.modelsMap = {};
    }
    SwaggerService.getInstance = function () {
        if (!SwaggerService.instance) {
            var newSwaggerService = new SwaggerService();
            newSwaggerService.initData();
            SwaggerService.instance = newSwaggerService;
        }
        return SwaggerService.instance;
    };
    SwaggerService.prototype.resetData = function () {
        this.controllerMap = {};
        this.initData();
    };
    SwaggerService.prototype.getData = function () {
        return _.cloneDeep(this.data);
    };
    SwaggerService.prototype.setBasePath = function (basePath) {
        this.data.basePath = basePath;
    };
    SwaggerService.prototype.setOpenapi = function (openapi) {
        this.data.openapi = openapi;
    };
    SwaggerService.prototype.setInfo = function (info) {
        this.data.info = info;
    };
    SwaggerService.prototype.setSchemes = function (schemes) {
        this.data.schemes = schemes;
    };
    SwaggerService.prototype.setProduces = function (produces) {
        this.data.produces = produces;
    };
    SwaggerService.prototype.setConsumes = function (consumes) {
        this.data.consumes = consumes;
    };
    SwaggerService.prototype.setHost = function (host) {
        this.data.host = host;
    };
    SwaggerService.prototype.setDefinitions = function (models) {
        var _a;
        var definitions = {};
        for (var modelIndex in models) {
            var model = models[modelIndex];
            var newDefinition = {
                type: swagger_definition_constant_1.SwaggerDefinitionConstant.Model.Type.OBJECT,
                properties: {},
                required: [],
            };
            if (model.description) {
                newDefinition.description = model.description;
            }
            for (var propertyIndex in model.properties) {
                var property = model.properties[propertyIndex];
                var newProperty = {
                    type: property.type,
                };
                newProperty.format = property.format;
                newProperty.description = property.description;
                newProperty.enum = property.enum;
                newProperty.example = property.example;
                if (property.itemType) {
                    newProperty.items = {
                        type: property.itemType,
                    };
                }
                if (property.model) {
                    if (_.isEqual(swagger_definition_constant_1.SwaggerDefinitionConstant.Model.Property
                        .Type.ARRAY, property.type)) {
                        newProperty.items = {
                            $ref: this.buildRef(property.model),
                        };
                    }
                    else {
                        newProperty.$ref = this.buildRef(property.model);
                    }
                }
                if (property.required) {
                    (_a = newDefinition.required) === null || _a === void 0 ? void 0 : _a.push(propertyIndex);
                }
                newDefinition.properties[propertyIndex] = newProperty;
            }
            definitions[modelIndex] = newDefinition;
        }
        this.data.definitions = _.mergeWith(this.data.definitions, definitions);
    };
    SwaggerService.prototype.setExternalDocs = function (externalDocs) {
        this.data.externalDocs = externalDocs;
    };
    SwaggerService.prototype.setGlobalResponses = function (globalResponses) {
        this.globalResponses =
            this.buildOperationResponses(globalResponses);
    };
    SwaggerService.prototype.addPath = function (args, target) {
        var currentController = {
            path: args.path,
            name: args.name,
            paths: {},
        };
        for (var controllerIndex in this.controllerMap) {
            var controller = this.controllerMap[controllerIndex];
            if (controllerIndex === target.name) {
                currentController = controller;
                currentController.path = args.path;
                currentController.name = args.name;
                currentController.description = args.description;
                currentController.security = args.security;
                currentController.deprecated = args.deprecated;
                currentController.groupProtalName =
                    args.groupProtalName;
            }
        }
        this.controllerMap[target.name] = _.mergeWith(this.controllerMap[target.name], currentController);
    };
    SwaggerService.prototype.addOperationGet = function (args, target, propertyKey) {
        assert.ok(args, 'Args are required.');
        assert.ok(args.responses, 'Responses are required.');
        if (args.parameters) {
            assert.ok(!args.parameters.body, 'Parameter body is not required.');
        }
        this.addOperation('get', args, target, propertyKey);
    };
    SwaggerService.prototype.addOperationPost = function (args, target, propertyKey) {
        assert.ok(args, 'Args are required.');
        assert.ok(args.parameters, 'Parameters are required.');
        assert.ok(args.responses, 'Responses are required.');
        this.addOperation('post', args, target, propertyKey);
    };
    SwaggerService.prototype.addOperationPut = function (args, target, propertyKey) {
        assert.ok(args, 'Args are required.');
        assert.ok(args.parameters, 'Parameters are required.');
        assert.ok(args.responses, 'Responses are required.');
        this.addOperation('put', args, target, propertyKey);
    };
    SwaggerService.prototype.addOperationPatch = function (args, target, propertyKey) {
        assert.ok(args, 'Args are required.');
        assert.ok(args.parameters, 'Parameters are required.');
        assert.ok(args.responses, 'Responses are required.');
        this.addOperation('patch', args, target, propertyKey);
    };
    SwaggerService.prototype.addOperationDelete = function (args, target, propertyKey) {
        assert.ok(args, 'Args are required.');
        assert.ok(args.parameters, 'Parameters are required.');
        assert.ok(!args.parameters.body, 'Parameter body is not required.');
        assert.ok(args.responses, 'Responses are required.');
        this.addOperation('delete', args, target, propertyKey);
    };
    SwaggerService.prototype.addSecurityDefinitions = function (securityDefinitions) {
        this.data.securityDefinitions = securityDefinitions;
    };
    SwaggerService.prototype.buildSwagger = function (controllerMap) {
        var data = _.cloneDeep(this.data);
        var _loop_1 = function (controllerIndex) {
            var controller = controllerMap[controllerIndex];
            if (_.toArray(controller.paths).length > 0) {
                for (var pathIndex in controller.paths) {
                    var path = controller.paths[pathIndex];
                    var swaggerPath = {};
                    if (path.get) {
                        swaggerPath.get = this_1.buildSwaggerOperation(path.get, controller);
                    }
                    if (path.post) {
                        swaggerPath.post = this_1.buildSwaggerOperation(path.post, controller);
                    }
                    if (path.put) {
                        swaggerPath.put = this_1.buildSwaggerOperation(path.put, controller);
                    }
                    if (path.patch) {
                        swaggerPath.patch =
                            this_1.buildSwaggerOperation(path.patch, controller);
                    }
                    if (path.delete) {
                        swaggerPath.delete =
                            this_1.buildSwaggerOperation(path.delete, controller);
                    }
                    if (path.path && path.path.length > 0) {
                        if (data.paths && controller.path) {
                            data.paths[controller.path.concat(path.path)] = __assign(__assign({}, data.paths[controller.path.concat(path.path)]), swaggerPath);
                        }
                    }
                    else {
                        if (data.paths && controller.path) {
                            data.paths[controller.path] = swaggerPath;
                        }
                    }
                }
            }
            else {
                var swaggerPath = {};
                if (data.paths && controller.path) {
                    data.paths[controller.path] = swaggerPath;
                }
            }
            if (!_.find(data.tags, function (tag) {
                return tag.name === _.upperFirst(controller.name);
            })) {
                if (data.tags) {
                    data.tags.push({
                        name: _.upperFirst(controller.name),
                        description: controller.description,
                    });
                }
            }
        };
        var this_1 = this;
        for (var controllerIndex in controllerMap) {
            _loop_1(controllerIndex);
        }
        return data;
    };
    SwaggerService.prototype.getDefinition = function (definition) {
        var mobileController = {};
        for (var controllerName in this.controllerMap) {
            var controller = this.controllerMap[controllerName];
            if (controller.groupProtalName ===
                definition.groupProtalName) {
                mobileController[controllerName] = controller;
            }
        }
        (0, swagger_builder_1.build)(definition);
        return this.buildSwagger(mobileController);
    };
    SwaggerService.prototype.addApiModelProperty = function (args, target, propertyKey, propertyType) {
        var definitionKey = target.constructor.name;
        var swaggerBuildDefinitionModel = this.modelsMap[definitionKey];
        if (!swaggerBuildDefinitionModel) {
            swaggerBuildDefinitionModel = {
                properties: {},
            };
            this.modelsMap[definitionKey] =
                swaggerBuildDefinitionModel;
        }
        var swaggerBuildDefinitionModelProperty = {
            type: _.lowerCase(propertyType),
        };
        if (args) {
            swaggerBuildDefinitionModelProperty.required =
                args.required;
            swaggerBuildDefinitionModelProperty.description =
                args.description;
            swaggerBuildDefinitionModelProperty.enum = args.enum;
            swaggerBuildDefinitionModelProperty.itemType =
                args.itemType;
            swaggerBuildDefinitionModelProperty.example =
                args.example;
            swaggerBuildDefinitionModelProperty.format = args.format;
            if (args.model) {
                swaggerBuildDefinitionModelProperty.model =
                    args.model;
                if (!_.isEqual('Array', propertyType)) {
                    swaggerBuildDefinitionModelProperty.type =
                        undefined;
                }
            }
            if (args.type) {
                swaggerBuildDefinitionModelProperty.type = args.type;
            }
        }
        swaggerBuildDefinitionModel.properties[propertyKey.toString()] = swaggerBuildDefinitionModelProperty;
        this.setDefinitions(this.modelsMap);
    };
    SwaggerService.prototype.addApiModel = function (args, target) {
        var definitionKey = target.name;
        var swaggerBuildDefinitionModel = this.modelsMap[definitionKey];
        if (!swaggerBuildDefinitionModel) {
            swaggerBuildDefinitionModel = {
                properties: {},
            };
            this.modelsMap[definitionKey] =
                swaggerBuildDefinitionModel;
        }
        if (args) {
            swaggerBuildDefinitionModel.description =
                args.description;
            if (args.name) {
                var name_1 = _.upperFirst(args.name);
                this.modelsMap[name_1] = _.cloneDeep(this.modelsMap[definitionKey]);
                if (!_.isEqual(name_1, definitionKey)) {
                    delete this.modelsMap[definitionKey];
                    delete this.data.definitions[definitionKey];
                }
            }
        }
        this.setDefinitions(this.modelsMap);
    };
    SwaggerService.prototype.initData = function () {
        this.data = {
            basePath: '/',
            info: {
                title: '',
                version: '',
            },
            paths: {},
            tags: [],
            schemes: [swagger_definition_constant_1.SwaggerDefinitionConstant.Scheme.HTTP],
            produces: [swagger_definition_constant_1.SwaggerDefinitionConstant.Produce.JSON],
            consumes: [swagger_definition_constant_1.SwaggerDefinitionConstant.Consume.JSON],
            definitions: {},
            swagger: '2.0',
        };
    };
    SwaggerService.prototype.addOperation = function (operation, args, target, propertyKey) {
        var currentController = {
            paths: {},
        };
        for (var index in this.controllerMap) {
            var controller = this.controllerMap[index];
            if (index === target.constructor.name) {
                currentController = controller;
            }
        }
        var currentPath = { path: '' };
        if (args.path && args.path.length > 0) {
            if (currentController.paths) {
                if (!currentController.paths[args.path]) {
                    currentController.paths[args.path] = {};
                }
                currentPath = currentController.paths[args.path];
                currentPath.path = args.path;
            }
        }
        else {
            if (currentController.paths) {
                if (!currentController.paths['/']) {
                    currentController.paths['/'] = {};
                }
                currentPath = currentController.paths['/'];
            }
        }
        if ('get' === operation) {
            currentPath.get = this.buildOperation(args, target, propertyKey);
        }
        if ('post' === operation) {
            currentPath.post = this.buildOperation(args, target, propertyKey);
        }
        if ('put' === operation) {
            currentPath.put = this.buildOperation(args, target, propertyKey);
        }
        if ('patch' === operation) {
            currentPath.patch = this.buildOperation(args, target, propertyKey);
        }
        if ('delete' === operation) {
            currentPath.delete = this.buildOperation(args, target, propertyKey);
        }
        this.controllerMap[target.constructor.name] =
            currentController;
    };
    SwaggerService.prototype.buildOperation = function (args, target, propertyKey) {
        var operation = {
            operationId: propertyKey,
            tags: [],
        };
        if (args.description) {
            operation.description = args.description;
        }
        if (args.summary) {
            operation.summary = args.summary;
        }
        if (args.produces && args.produces.length > 0) {
            operation.produces = args.produces;
        }
        if (args.consumes && args.consumes.length > 0) {
            operation.consumes = args.consumes;
        }
        if (args.tags && args.tags.length > 0) {
            operation.tags = args.tags;
        }
        if (args.deprecated) {
            operation.deprecated = args.deprecated;
        }
        if (args.parameters) {
            operation.parameters = [];
            if (args.parameters.header) {
                operation.parameters = _.concat(operation.parameters, this.buildParameters(swagger_definition_constant_1.SwaggerDefinitionConstant.Parameter.In.HEADER, args.parameters.header));
            }
            if (args.parameters.path) {
                operation.parameters = _.concat(operation.parameters, this.buildParameters(swagger_definition_constant_1.SwaggerDefinitionConstant.Parameter.In.PATH, args.parameters.path));
            }
            if (args.parameters.query) {
                operation.parameters = _.concat(operation.parameters, this.buildParameters(swagger_definition_constant_1.SwaggerDefinitionConstant.Parameter.In.QUERY, args.parameters.query));
            }
            if (args.parameters.body) {
                operation.parameters = _.concat(operation.parameters, this.buildBodyOperationParameter(args.parameters.body));
            }
            if (args.parameters.formData) {
                operation.parameters = _.concat(operation.parameters, this.buildParameters(swagger_definition_constant_1.SwaggerDefinitionConstant.Parameter.In
                    .FORM_DATA, args.parameters.formData));
            }
        }
        if (args.responses) {
            operation.responses = this.buildOperationResponses(args.responses);
        }
        if (args.security) {
            operation.security = this.buildOperationSecurity(args.security);
        }
        return operation;
    };
    SwaggerService.prototype.buildOperationResponses = function (responses) {
        var swaggerOperationResponses = {};
        for (var responseIndex in responses) {
            var response = responses[responseIndex];
            var newSwaggerOperationResponse = {};
            if (response.description) {
                newSwaggerOperationResponse.description =
                    response.description;
            }
            else {
                switch (responseIndex) {
                    case '200':
                        newSwaggerOperationResponse.description =
                            'Success';
                        break;
                    case '201':
                        newSwaggerOperationResponse.description =
                            'Created';
                        break;
                    case '202':
                        newSwaggerOperationResponse.description =
                            'Accepted';
                        break;
                    case '203':
                        newSwaggerOperationResponse.description =
                            'Non-Authoritative Information';
                        break;
                    case '204':
                        newSwaggerOperationResponse.description =
                            'No Content';
                        break;
                    case '205':
                        newSwaggerOperationResponse.description =
                            'Reset Content';
                        break;
                    case '206':
                        newSwaggerOperationResponse.description =
                            'Partial Content';
                        break;
                    case '400':
                        newSwaggerOperationResponse.description =
                            'Client error and Bad Request';
                        break;
                    case '401':
                        newSwaggerOperationResponse.description =
                            'Client error and Unauthorized';
                        break;
                    case '404':
                        newSwaggerOperationResponse.description =
                            'Client error and Not Found';
                        break;
                    case '406':
                        newSwaggerOperationResponse.description =
                            'Client error and Not Acceptable';
                        break;
                    case '500':
                        newSwaggerOperationResponse.description =
                            'Internal Server Error';
                        break;
                    case '501':
                        newSwaggerOperationResponse.description =
                            'Not Implemented';
                        break;
                    case '503':
                        newSwaggerOperationResponse.description =
                            'Service Unavailable';
                        break;
                    default:
                        newSwaggerOperationResponse.description =
                            null;
                }
            }
            if (response.model) {
                var ref = this.buildRef(response.model);
                var newSwaggerOperationResponseSchema = {
                    $ref: ref,
                };
                if (_.isEqual(response.type, swagger_definition_constant_1.SwaggerDefinitionConstant.Response.Type.ARRAY)) {
                    newSwaggerOperationResponseSchema = {
                        items: {
                            $ref: ref,
                        },
                        type: swagger_definition_constant_1.SwaggerDefinitionConstant.Response.Type
                            .ARRAY,
                    };
                }
                newSwaggerOperationResponse.schema =
                    newSwaggerOperationResponseSchema;
            }
            swaggerOperationResponses[responseIndex] =
                newSwaggerOperationResponse;
        }
        return swaggerOperationResponses;
    };
    SwaggerService.prototype.buildBodyOperationParameter = function (bodyOperationArgsBaseParameter) {
        var swaggerOperationParameterList = [];
        var swaggerOperationParameter = {};
        swaggerOperationParameter.name =
            bodyOperationArgsBaseParameter.name
                ? bodyOperationArgsBaseParameter.name
                : 'body';
        swaggerOperationParameter.in = 'body';
        swaggerOperationParameter.type =
            bodyOperationArgsBaseParameter.type;
        swaggerOperationParameter.description =
            bodyOperationArgsBaseParameter.description;
        swaggerOperationParameter.required =
            bodyOperationArgsBaseParameter.required;
        swaggerOperationParameter.format =
            bodyOperationArgsBaseParameter.format;
        swaggerOperationParameter.deprecated =
            bodyOperationArgsBaseParameter.deprecated;
        swaggerOperationParameter.allowEmptyValue =
            bodyOperationArgsBaseParameter.allowEmptyValue;
        swaggerOperationParameter.minimum =
            bodyOperationArgsBaseParameter.minimum;
        swaggerOperationParameter.maximum =
            bodyOperationArgsBaseParameter.maximum;
        swaggerOperationParameter.default =
            bodyOperationArgsBaseParameter.default;
        var schema = {};
        if (bodyOperationArgsBaseParameter.properties) {
            schema.type = 'object';
            schema.required = [];
            schema.properties = {};
            for (var propetyIndex in bodyOperationArgsBaseParameter.properties) {
                var propertyBodyOperationArgsBaseParameter = bodyOperationArgsBaseParameter.properties[propetyIndex];
                var propertySchemaOperation = {};
                propertySchemaOperation.type =
                    propertyBodyOperationArgsBaseParameter.type;
                schema.properties[propetyIndex] =
                    propertySchemaOperation;
                if (schema.properties[propetyIndex].type === 'array') {
                    if (propertyBodyOperationArgsBaseParameter.items) {
                        schema.properties[propetyIndex].items =
                            propertyBodyOperationArgsBaseParameter.items;
                    }
                }
                if (schema.properties[propetyIndex].type === 'object') {
                    if (propertyBodyOperationArgsBaseParameter.$ref) {
                        schema.properties[propetyIndex].$ref =
                            propertyBodyOperationArgsBaseParameter.$ref;
                    }
                }
                if (propertyBodyOperationArgsBaseParameter.required) {
                    schema.required.push(propetyIndex);
                }
            }
        }
        if (bodyOperationArgsBaseParameter.model) {
            var swaggerOperationSchema = {
                $ref: this.buildRef(bodyOperationArgsBaseParameter.model),
            };
            if (bodyOperationArgsBaseParameter.type !== 'array') {
                schema = swaggerOperationSchema;
            }
            else {
                schema.type = bodyOperationArgsBaseParameter.type;
                schema.items = {
                    $ref: this.buildRef(bodyOperationArgsBaseParameter.model),
                };
            }
        }
        swaggerOperationParameter.schema = schema;
        swaggerOperationParameterList.push(swaggerOperationParameter);
        return swaggerOperationParameterList;
    };
    SwaggerService.prototype.buildOperationSecurity = function (argsSecurity) {
        var securityToReturn = [];
        for (var securityIndex in argsSecurity) {
            var security = argsSecurity[securityIndex];
            var result = {};
            result[securityIndex] = security;
            securityToReturn.push(result);
        }
        return securityToReturn;
    };
    SwaggerService.prototype.buildParameters = function (type, parameters) {
        var swaggerOperationParameter = [];
        for (var parameterIndex in parameters) {
            var parameter = parameters[parameterIndex];
            var newSwaggerOperationParameter = {
                name: parameterIndex,
                in: type,
                type: parameter.type,
                items: parameter.items,
            };
            if (parameter.name) {
                newSwaggerOperationParameter.name = parameter.name;
            }
            newSwaggerOperationParameter.description =
                parameter.description;
            newSwaggerOperationParameter.required =
                parameter.required;
            newSwaggerOperationParameter.format = parameter.format;
            newSwaggerOperationParameter.deprecated =
                parameter.deprecated;
            newSwaggerOperationParameter.allowEmptyValue =
                parameter.allowEmptyValue;
            newSwaggerOperationParameter.minimum = parameter.minimum;
            newSwaggerOperationParameter.maximum = parameter.maximum;
            newSwaggerOperationParameter.default = parameter.default;
            swaggerOperationParameter.push(newSwaggerOperationParameter);
        }
        return swaggerOperationParameter;
    };
    SwaggerService.prototype.buildSwaggerOperation = function (operation, controller) {
        if (_.isUndefined(operation.produces)) {
            operation.produces = this.data.produces;
        }
        if (_.isUndefined(operation.consumes)) {
            operation.consumes = this.data.consumes;
        }
        if (_.isUndefined(operation.security) &&
            controller.security) {
            operation.security = this.buildOperationSecurity(controller.security);
        }
        if (_.isUndefined(operation.deprecated) &&
            controller.deprecated) {
            operation.deprecated = controller.deprecated;
        }
        if (this.globalResponses) {
            operation.responses = _.mergeWith(_.cloneDeep(this.globalResponses), operation.responses);
        }
        if (operation.tags && operation.tags.length > 0) {
            operation.tags.unshift(_.upperFirst(controller.name));
        }
        else {
            operation.tags = [_.upperFirst(controller.name)];
        }
        return operation;
    };
    SwaggerService.prototype.buildRef = function (definition) {
        return '#/definitions/'.concat(_.upperFirst(definition));
    };
    return SwaggerService;
}());
exports.SwaggerService = SwaggerService;
//# sourceMappingURL=swagger.service.js.map