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
        while (_) try {
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
exports.__esModule = true;
exports.CategorySchema = exports.ProjectSchema = void 0;
var fs = require("fs");
var fastcsv = require("fast-csv");
var stream = fs.createReadStream("CSV Projects.csv");
var mongoose = require("mongoose");
var app_1 = require("./app");
var userDB = {};
var categoryDB = {};
exports.ProjectSchema = new mongoose.Schema({
    projectTitle: { type: String, required: true, unique: true, "default": ' ' },
    projectOwners: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users'
    },
    projectManagers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users'
    },
    projectMembers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users'
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    projectDescription: { type: String, trim: true },
    sector: { type: String },
    projectExecution: { type: String },
    primaryClient: { type: String, trim: true },
    secondaryClient: { type: String, trim: true },
    projectType: { type: String },
    geography: { type: String },
    projectBudget: { type: Number },
    projectBillable: { type: Boolean },
    files: { type: [{ fileName: String, fileKey: String, createdAt: Date }] },
    projectProposal: { type: Boolean },
    workOrderReceived: { type: Boolean },
    anyAgreementSigned: { type: Boolean },
    projectClosed: { type: Boolean },
    oPE: { type: Boolean },
    oPEAmount: { type: Number },
    subContractBudget: { type: Number },
    totalProjectValue: { type: Number },
    projectStatus: { type: Boolean },
    trashProject: { type: Boolean },
    typeOfProjectBasis: { type: String },
    category: { type: String, ref: 'categories' },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    mileStones: [{
            mileStoneName: String,
            amount: Number,
            completionDate: String
        }]
}, { timestamps: true, versionKey: false });
exports.CategorySchema = new mongoose.Schema({
    category: { type: String, required: false }
}, { timestamps: true, versionKey: false });
var url = "mongodb://dev_admin:e49HgPvc79Hn@159.89.171.29:27017/test?authSource=admin";
var ProjectModel = mongoose.model('Project', exports.ProjectSchema);
;
var UserModel = mongoose.model('User', app_1.UserSchema);
var CategoryModel = mongoose.model('Category', exports.CategorySchema, "categories");
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
var ownerObj;
var managerObj;
var categoryObj;
var csvData = [];
var csvStream = fastcsv
    .parse()
    .on("data", function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var projectMembers, response, i, element, arrayOfData, element;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!data[3]) return [3 /*break*/, 2];
                return [4 /*yield*/, findUser(data[3])];
            case 1:
                ownerObj = _a.sent();
                _a.label = 2;
            case 2:
                if (!data[4]) return [3 /*break*/, 4];
                return [4 /*yield*/, findUser(data[4])];
            case 3:
                managerObj = _a.sent();
                _a.label = 4;
            case 4:
                projectMembers = [];
                if (!(data[5] === "All Employees")) return [3 /*break*/, 6];
                return [4 /*yield*/, UserModel.find()];
            case 5:
                response = _a.sent();
                for (i = 0; i < response.length; i++) {
                    element = response[i]._id;
                    projectMembers.push(element);
                }
                return [3 /*break*/, 10];
            case 6:
                arrayOfData = data[5] && data[5].split(";");
                if (!(arrayOfData.length > 0)) return [3 /*break*/, 10];
                i = 0;
                _a.label = 7;
            case 7:
                if (!(i < arrayOfData.length)) return [3 /*break*/, 10];
                return [4 /*yield*/, findUser(arrayOfData[i])];
            case 8:
                element = _a.sent();
                projectMembers.push(element._id);
                _a.label = 9;
            case 9:
                i++;
                return [3 /*break*/, 7];
            case 10:
                if (!data[12]) return [3 /*break*/, 12];
                return [4 /*yield*/, findCategory(data[12])];
            case 11:
                categoryObj = _a.sent();
                _a.label = 12;
            case 12:
                console.log(categoryObj);
                csvData.push({
                    projectTitle: data[1],
                    projecOwners: [ownerObj && ownerObj._id || ''],
                    projectManagers: [managerObj && managerObj._id || ''],
                    projectMembers: projectMembers,
                    startDate: data[7] ? data[8] : '',
                    endDate: data[8] ? data[8] : '',
                    projectDescription: data[2] ? data[2] : '',
                    sector: data[16] ? data[16] : '',
                    projectExecution: data[17] ? data[17] : '',
                    primaryClient: data[18] ? data[18] : '',
                    secondaryClient: data[19] ? data[19] : '',
                    projectType: data[9] ? data[9] : '',
                    geography: data[20] ? data[20] : '',
                    // projectBudget: data[],
                    projectBillable: data[13] ? data[13] : '',
                    files: data[28] ? data[28] : '',
                    projectProposal: data[22] ? data[22] : '',
                    workOrderReceived: data[24] ? data[24] : '',
                    anyAgreementSigned: data[23] ? data[23] : '',
                    // projectClosed: data[14],
                    // oPE:data[25] ? 'true' : 'false',
                    oPEAmount: data[25] ? data[25] : '',
                    subContractBudget: data[26] ? data[26] : '',
                    totalProjectValue: data[27] ? data[27] : '',
                    projectStatus: data[10] ? data[10] : '',
                    trashProject: data[11] ? data[11] : '',
                    typeOfProjectBasis: data[29] ? data[29] : '',
                    category: categoryObj && categoryObj._id || '',
                    mileStones: data[30] ? data[30] : ''
                });
                return [2 /*return*/];
        }
    });
}); })
    .on("end", function () {
    csvData.shift();
    console.log(csvData);
    // mongodb.connect(
    //     url,
    //     { useNewUrlParser: true, useUnifiedTopology: true },
    //     (err, client) => {
    //         if (err) throw err;
    //         ProjectModel.insertMany(
    //             csvData
    //         ).then(function () {
    //             console.log("Data inserted")
    //         }).catch(function (error) {
    //             console.log(error)
    //         });
    //     }
    // );
});
stream.pipe(csvStream);
var findUser = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var userInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(email in userDB)) return [3 /*break*/, 1];
                return [2 /*return*/, userDB[email]];
            case 1: return [4 /*yield*/, UserModel.findOne({ email: email })];
            case 2:
                userInfo = _a.sent();
                userDB[email] = userInfo;
                return [2 /*return*/, userInfo];
        }
    });
}); };
var findCategory = function (categoryType) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(categoryType in categoryDB)) return [3 /*break*/, 1];
                return [2 /*return*/, categoryDB[categoryType]];
            case 1: return [4 /*yield*/, CategoryModel.findOne({ category: categoryType })];
            case 2:
                response = _a.sent();
                categoryDB[categoryType] = response;
                return [2 /*return*/, response];
        }
    });
}); };
