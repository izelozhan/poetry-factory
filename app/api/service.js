"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var weaviate_ts_client_1 = require("weaviate-ts-client");
var client;
var collectionName = "Poem_dataset";
// This variable will be used to store if collection data has been loaded, or needs to be loaded
var collectionDataVerified = false;
var retreiveCollectionData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var fileString;
    return __generator(this, function (_a) {
        fileString = fs.readFileSync("dataset.json");
        return [2 /*return*/, JSON.parse(fileString.toString())];
    });
}); };
var collectionClass = {
    class: collectionName,
    vectorizer: "text2vec-openai",
    moduleConfig: {
        "text2vec-openai": {},
        "generative-openai": {},
    },
};
// Create a collection with the given name and insert data into it
// If the collection already exists, return the existing collection
var createCollection = function (name, client) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, client.schema
                        .classCreator()
                        .withClass(collectionClass)
                        .do()];
            case 1:
                result = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error(error_1);
                throw Error("Failed to create collection ".concat(name));
            case 3: return [4 /*yield*/, insertToCollection(client)];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var insertToCollection = function (client) { return __awaiter(void 0, void 0, void 0, function () {
    var data, batcher, counter, batchSize, _i, data_1, record, obj, res_1, res, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, retreiveCollectionData()];
            case 1:
                data = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 8, , 9]);
                batcher = client.batch.objectsBatcher();
                counter = 0;
                batchSize = 1000;
                _i = 0, data_1 = data;
                _a.label = 3;
            case 3:
                if (!(_i < data_1.length)) return [3 /*break*/, 6];
                record = data_1[_i];
                obj = {
                    class: collectionName,
                    properties: {
                        title: record.Title,
                        poem: record.Poem,
                        poet: record.Poet,
                        genre: record.Genre,
                    },
                };
                batcher = batcher.withObject(obj);
                if (!(counter++ == batchSize)) return [3 /*break*/, 5];
                return [4 /*yield*/, batcher.do()];
            case 4:
                res_1 = _a.sent();
                console.log('batch_inserted');
                counter = 0;
                batcher = client.batch.objectsBatcher();
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, batcher.do()];
            case 7:
                res = _a.sent();
                console.log(res);
                return [3 /*break*/, 9];
            case 8:
                error_2 = _a.sent();
                throw Error("Failed to insert data into collection ".concat(name));
            case 9: return [2 /*return*/];
        }
    });
}); };
var ensureCollectionExists = function (name, client) { return __awaiter(void 0, void 0, void 0, function () {
    var collections, collectionExists, filter, isEmpty;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, client.schema.getter().do()];
            case 1:
                collections = _b.sent();
                collectionExists = (_a = collections.classes) === null || _a === void 0 ? void 0 : _a.some(function (i) { var _a; return ((_a = i.class) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === (name === null || name === void 0 ? void 0 : name.toLowerCase()); });
                if (!!collectionExists) return [3 /*break*/, 3];
                return [4 /*yield*/, createCollection(name, client)];
            case 2:
                _b.sent();
                return [3 /*break*/, 5];
            case 3:
                if (!(collectionDataVerified == false)) return [3 /*break*/, 5];
                return [4 /*yield*/, client.graphql
                        .get()
                        .withClassName(name)
                        .withFields("title")
                        .withLimit(1)
                        .do()];
            case 4:
                filter = _b.sent();
                isEmpty = filter.data.length === 0;
                if (isEmpty) {
                    //maybe failed to insert data, try again
                    insertToCollection(client);
                }
                collectionDataVerified = true;
                _b.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
var getClient = function () { return __awaiter(void 0, void 0, void 0, function () {
    var serviceURL, serviceApiKey, openAIKey, client_1;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                serviceURL = (_a = process.env) === null || _a === void 0 ? void 0 : _a.WCD_URL;
                serviceApiKey = (_b = process.env) === null || _b === void 0 ? void 0 : _b.WCD_API_KEY;
                openAIKey = (_c = process.env) === null || _c === void 0 ? void 0 : _c.OPENAI_APIKEY;
                if (!(!serviceURL || !serviceApiKey)) return [3 /*break*/, 1];
                throw Error("Can't generate client without service URL and API key.");
            case 1:
                if (!!openAIKey) return [3 /*break*/, 2];
                throw Error("Can't generate client without OpenAI API key.");
            case 2:
                client_1 = weaviate_ts_client_1.default.client({
                    scheme: "https",
                    host: serviceURL,
                    apiKey: new weaviate_ts_client_1.ApiKey(serviceApiKey),
                    headers: { "X-OpenAI-Api-Key": openAIKey },
                });
                return [4 /*yield*/, ensureCollectionExists(collectionName, client_1)];
            case 3:
                _d.sent();
                return [2 /*return*/, client_1];
        }
    });
}); };
var getWritersBasedOnFeeling = function (client, feeling) { return __awaiter(void 0, void 0, void 0, function () {
    var response, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.graphql
                    .aggregate()
                    .withClassName(collectionName)
                    .withWhere({
                    path: ["genre"],
                    operator: "Equal",
                    valueText: feeling,
                })
                    .withGroupBy(["poet"])
                    .withFields("groupedBy { value } meta { count }")
                    .do()];
            case 1:
                response = _a.sent();
                result = response.data.Aggregate[collectionName]
                    .map(function (i) { return i.groupedBy.value; })
                    .sort();
                return [2 /*return*/, result];
        }
    });
}); };
var getGenres = function (client) { return __awaiter(void 0, void 0, void 0, function () {
    var response, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.graphql
                    .aggregate()
                    .withClassName(collectionName)
                    .withGroupBy(["genre"])
                    .withFields("groupedBy { value } meta { count }")
                    .do()];
            case 1:
                response = _a.sent();
                result = response.data.Aggregate[collectionName]
                    .map(function (i) { return i.groupedBy.value; })
                    .sort();
                return [2 /*return*/, result];
        }
    });
}); };
var generate = function (client, feeling, writers, concept) { return __awaiter(void 0, void 0, void 0, function () {
    var response, poem;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, client.graphql
                    .get()
                    .withClassName(collectionName)
                    .withWhere({
                    operator: "And",
                    operands: [
                        {
                            path: ["genre"],
                            operator: "Equal",
                            valueText: feeling,
                        },
                        {
                            path: ["poet"],
                            operator: "ContainsAny",
                            valueStringArray: writers,
                        },
                    ],
                })
                    .withGenerate({
                    singlePrompt: "\n                You are provided with poems {poem} reflecting ".concat(feeling, " feeling from writers ").concat(writers.join(", "), ".\n                You should write a poem about ").concat(feeling, ". \n                ").concat(concept
                        ? "Poem needs to involve following thought / concept: ".concat(concept)
                        : "", "\n                "),
                })
                    .withFields("poem")
                    .withLimit(1)
                    .do()];
            case 1:
                response = _d.sent();
                poem = (_c = (_b = (_a = (response.data.Get[collectionName] || []).at(0)) === null || _a === void 0 ? void 0 : _a["_additional"]) === null || _b === void 0 ? void 0 : _b["generate"]) === null || _c === void 0 ? void 0 : _c["singleResult"];
                if (!poem) {
                    return [2 /*return*/, "I am sorry, I could not generate a poem for you. Trying to find muse. Please try again later."];
                }
                else {
                    return [2 /*return*/, poem];
                }
                return [2 /*return*/];
        }
    });
}); };
var startup = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getClient()];
            case 1:
                _a.sent();
                console.log('collection exists');
                return [2 /*return*/];
        }
    });
}); };
var service = {
    getPoets: function (feeling) { return __awaiter(void 0, void 0, void 0, function () {
        var client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getClient()];
                case 1:
                    client = _a.sent();
                    return [4 /*yield*/, getWritersBasedOnFeeling(client, feeling)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    getFeelings: function () { return __awaiter(void 0, void 0, void 0, function () {
        var client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getClient()];
                case 1:
                    client = _a.sent();
                    return [4 /*yield*/, getGenres(client)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    generate: function (feeling, poets, concept) { return __awaiter(void 0, void 0, void 0, function () {
        var client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getClient()];
                case 1:
                    client = _a.sent();
                    return [2 /*return*/, generate(client, feeling, poets, concept)];
            }
        });
    }); },
    startup: startup
};
exports.default = service;
