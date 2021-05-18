import * as fs from 'fs';
import * as  mongodb from "mongodb";
import * as  fastcsv from "fast-csv";
let stream = fs.createReadStream("CSV Projects.csv");
const assert = require('assert');
import { Document } from "mongoose";
import * as mongoose from 'mongoose';
import { UserSchema } from './app';
import { IUser } from './User.interface';

const userDB: any = {};
const categoryDB: any = {};
export interface IProject extends Document {
    projectTitle: string;
    projectOwners: string[];
    projectManagers: string[];
    projectMembers: string[];
    startDate: Date;
    endDate: Date;
    projectDescription: string;
    sector: string;
    projectExecution: string;
    primaryClient: string;
    secondaryClient: string;
    projectType: string;
    geography: string;
    projectBudget: number;
    projectBillable: boolean;
    projectProposal: boolean;
    workOrderReceived: boolean;
    anyAgreementSigned: boolean;
    projectClosed: boolean;
    oPE: boolean;
    oPEAmount: number;
    subContractBudget: number;
    totalProjectValue: number;
    projectStatus: boolean;
    trashProject: boolean;
    mileStoneName: string[];
    amount: number[];
    completionDate: Date[];
    typeOfProjectBasis: string;
    files: IFilesDetails[]
    mileStones: MileStone[];
    category: string;
    createdBy: string;
}

export interface IFilesDetails {
    fileName: string;
    fileKey: string;
    createdAt: Date;
}

export interface MileStone {
    mileStoneName: string;
    amount?: number;
    completionDate: string;
}
export interface ICategory extends Document {
    category: string;
}
export const ProjectSchema: mongoose.Schema = new mongoose.Schema({
    projectTitle: { type: String, unique: true },
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
    startDate: { type: Date },
    endDate: { type: Date },
    projectDescription: { type: String, trim: true },
    sector: { type: String },
    projectExecution: { type: String },
    primaryClient: { type: String, trim: true, },
    secondaryClient: { type: String, trim: true, },
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
        ref: 'users',
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },

    mileStones: [{
        mileStoneName: String,
        amount: Number,
        completionDate: String,
    }],
}, { timestamps: true, versionKey: false });

export const CategorySchema: mongoose.Schema = new mongoose.Schema({
    category: { type: String, required: false }
}, { timestamps: true, versionKey: false })

let url = "mongodb://dev_admin:e49HgPvc79Hn@159.89.171.29:27017/test?authSource=admin";

const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);
const UserModel = mongoose.model<IUser>('User', UserSchema);
const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema, "categories")
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log("connected")
})
// mongoose.connect(url, { bufferMaxEntries: 0 });

let ownerObj: IUser;
let managerObj: IUser;
let categoryObj: ICategory;
let csvData: mongoose.AnyObject = [];
let csvStream = fastcsv
    .parse({ headers: true })
    .on("data", async (data) => {
        if (data['projectOwners']) {
            ownerObj = await findUser(data['projectOwners']);
        }
        if (data['projectManagers']) {
            managerObj = await findUser(data['projectManagers']);
        }
        let projectMembers: string[] = [];
        if (data['projectMembers'] === "All Employees") {
            const response = await UserModel.find();
            for (let i = 0; i < response.length; i++) {
                let element = response[i]._id;
                projectMembers.push(element)
            }
        }
        else {
            let arrayOfProjectMembers: string[] = data['projectMembers'].split(";").filter((item: any) => item);
            try {
                if (arrayOfProjectMembers && arrayOfProjectMembers.length > 0) {
                    for (let i = 0; i < arrayOfProjectMembers.length; i++) {
                        let element = await findUser(arrayOfProjectMembers[i]);
                        if (element) {
                            projectMembers.push(element._id);
                        }
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
        if (data['category']) {
            categoryObj = await findCategory(data['category']);
        }
        // console.log(categoryObj)
        await ProjectModel.insertMany({
            projectTitle: data['projectTitle'] ? data['projectTitle'] : null,
            projectOwners: [ownerObj._id],
            projectManagers: [managerObj._id],
            projectMembers: projectMembers,
            startDate: new Date(),
            endDate: new Date(),
            projectDescription: data['projectDescription'] ? data['projectDescription'] : '',
            sector: data['sector'] ? data['sector'] : '',
            projectExecution: data['projectExecution'] ? data['projectExecution'] : '',
            primaryClient: data['primaryClient'] ? data['primaryClient'] : '',
            secondaryClient: data['secondaryClient'] ? data['secondaryClient'] : '',
            projectType: data['projectType'] ? data['projectType'] : '',
            geography: data['geography'] ? data['geography'] : '',
            projectBudget: 0,
            projectBillable: data['projectBillable'] === "Billable" ? true : false,
            files: [],
            projectProposal: data['projectProposal'] ? data['projectProposal'] : false,
            workOrderReceived: data['workOrderReceived'] ? data['workOrderReceived'] : false,
            anyAgreementSigned: data['anyAgreementSigned'] ? data['anyAgreementSigned'] : false,
            projectClosed: data['projectClosed'] === "Open" ? true : false,
            oPE: data['oPEAmount'] ? 'true' : 'false',
            oPEAmount: data['oPEAmount'] ? data['oPEAmount'] : null,
            subContractBudget: data['subContractBudget'] ? data['subContractBudget'] : null,
            totalProjectValue: data['totalProjectValue'] ? data['totalProjectValue'] : null,
            projectStatus: data['projectStatus'] === "Active" ? true : false,
            trashProject: data['trashProject'] === "FALSE" ? false : true,
            typeOfProjectBasis: data['typeOfProjectBasis'] ? data['typeOfProjectBasis'] : '',
            category: categoryObj ? categoryObj._id : '',
            // mileStones: data['mileStones'] ? data['mileStones'] : [],
            // projectTitle: data[1],
            // projectOwners: [ownerObj && ownerObj._id || ''],
            // projectManagers: [managerObj && managerObj._id || ''],
            // projectMembers: projectMembers && projectMembers || '',
            // startDate: data[7] ? data[8] : '',
            // endDate: data[8] ? data[8] : '',
            // projectDescription: data[2] ? data[2] : '',
            // sector: data[16] ? data[16] : '',
            // projectExecution: data[17] ? data[17] : '',
            // primaryClient: data[18] ? data[18] : '',
            // secondaryClient: data[19] ? data[19] : '',
            // projectType: data[9] ? data[9] : '',
            // geography: data[20] ? data[20] : '',
            // // projectBudget: ,
            // projectBillable: data[13] === "Billable" ? true : false,
            // files: data[28] ? data[28] : '',
            // projectProposal: data[22] ? data[22] : false,
            // workOrderReceived: false,
            // anyAgreementSigned: data[23] ? data[23] : false,
            // projectClosed: data[14] === "Open" ? true : false,
            // // oPE:data[25] ? 'true' : 'false',
            // oPEAmount: data[25] ? data[25] : 0,
            // subContractBudget: data[26] ? data[26] : 0,
            // totalProjectValue: data[27] ? data[27] : 0,
            // projectStatus: data[10] === "Active" ? true : false,
            // trashProject: data[11] === "FALSE" ? false : true,
            // typeOfProjectBasis: data[29] ? data[29] : '',
            // category: categoryObj && categoryObj._id || '',
            // mileStones: data[30] ? data[30] : '',
        });
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
    })
    .on("end", () => {

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



const findUser = async (email: string) => {
    if (email in userDB) {
        return userDB[email];
    }
    else {
        const userInfo = await UserModel.findOne({ email }) as IUser;
        userDB[email] = userInfo;
        return userInfo
    }
}

const findCategory = async (categoryType: string) => {
    if (categoryType in categoryDB) {
        return categoryDB[categoryType]
    }
    else {
        const response = await CategoryModel.findOne({ category: categoryType });
        categoryDB[categoryType] = response;
        return response;
    }
}



