"use strict";
exports.__esModule = true;
exports.UserModel = exports.UserSchema = void 0;
var fs = require("fs");
var fastcsv = require("fast-csv");
var stream = fs.createReadStream("data.csv");
var mongoose = require("mongoose");
exports.UserSchema = new mongoose.Schema({
    empId: { type: String, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    userName: { type: String, required: true, trim: true },
    roles: {
        type: Array, required: true
    },
    designation: { type: String, required: true },
    mobileNo: { type: String },
    cost: { type: Number, required: true },
    location: { type: String, required: true, "default": ' ' }
}, { timestamps: true, versionKey: false });
// var url = "mongodb://dev_admin:e49HgPvc79Hn@159.89.171.29:27017/test?authSource=admin";
var url = "mongodb://admin:re33Z77q#mPj![1@143.110.240.143:27017/p3l_dev?authSource=admin";
exports.UserModel = mongoose.model('User', exports.UserSchema);
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
var csvData = [];
var csvStream = fastcsv
    .parse()
    .on("data", function (data) {
    csvData.push({
        empId: data[0],
        userName: data[1] + ' ' + data[2],
        email: data[3],
        designation: data[4],
        cost: data[5],
        roles: ["6082605db04f7a0ec10452fc"]
    });
})
    .on("end", function () {
    csvData.shift();
    console.log(csvData);
    csvData.push.apply(csvData, [
        {
            empId: '1',
            userName: 'Dev 1',
            email: 'dev1@primuspartners.in',
            designation: 'Admin',
            cost: '100000',
            roles: ['6087b58ecae447079479976f']
        },
        {
            empId: '2',
            userName: 'Dev 2',
            email: 'dev2@primuspartners.in',
            designation: 'User',
            cost: '100000',
            roles: ['6082605db04f7a0ec10452fc']
        },
        {
            empId: '3',
            userName: 'Dev 3',
            email: 'dev3@primuspartners.in',
            designation: 'Super Admin',
            cost: '100000',
            roles: ['60824981b04f7a0ec10452f8']
        }
    ]);
    // mongodb.connect(
    //     url,
    //     { useNewUrlParser: true, useUnifiedTopology: true },
    //     (err, client) => {
    //         if (err) throw err;
    //         UserModel.insertMany(
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
