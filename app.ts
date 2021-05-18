import * as fs from 'fs';
import * as  mongodb from "mongodb";
import * as  fastcsv from "fast-csv";
let stream = fs.createReadStream("data.csv");
import { IUser } from './User.interface';
import * as mongoose from 'mongoose';

export const UserSchema: mongoose.Schema = new mongoose.Schema({
    empId: { type: String, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    userName: { type: String, required: true, trim: true },
    roles: {
        type: Array, required: true
    },
    designation: { type: String, required: true },
    mobileNo: { type: String, },
    cost: { type: Number, required: true },
    location: { type: String, required: true, default: ' ' },
}, { timestamps: true, versionKey: false });

let url = "mongodb://dev_admin:e49HgPvc79Hn@159.89.171.29:27017/test?authSource=admin";
// let url = "mongodb://admin:re33Z77q#mPj![1@143.110.240.143:27017/p3l_dev?authSource=admin";

export const UserModel = mongoose.model<IUser>('User', UserSchema);
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

let csvData: mongoose.AnyObject = [];
let csvStream = fastcsv
    .parse()
    .on("data", (data) => {
        csvData.push({
            empId: data[0],
            userName: data[1] + ' ' + data[2],
            email: data[3],
            designation: data[4],
            cost: data[6],
            roles: ["6082605db04f7a0ec10452fc"]
        });
    })
    .on("end", () => {
        csvData.shift();
        console.log(csvData);
        csvData.push(...[
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
            }
            ,
            {
                empId: '3',
                userName: 'Dev 3',
                email: 'dev3@primuspartners.in',
                designation: 'Super Admin',
                cost: '100000',
                roles: ['60824981b04f7a0ec10452f8']
            }

        ])
        mongodb.connect(
            url,
            { useNewUrlParser: true, useUnifiedTopology: true },
            (err, client) => {
                if (err) throw err;
                UserModel.insertMany(
                    csvData
                ).then(function () {
                    console.log("Data inserted")
                }).catch(function (error) {
                    console.log(error)
                });
            }
        );
    });

stream.pipe(csvStream);
