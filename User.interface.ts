import { Document } from "mongoose";

export interface IUser extends Document, UserSchema {
}

export interface UserSchema {
    email: string;
    userName: string;
    roles: string[];
    mobileNo: null,
    designation: string;
    cost: number;
    location: string
}


export interface AzureUserListResponse {
    businessPhones: Array<number>,
    displayName: string,
    givenName: null,
    jobTitle: null,
    mail: string,
    mobilePhone: null,
    officeLocation: null,
    preferredLanguage: null,
    surname: null,
    userPrincipalName: string,
    id: string
}


export interface AzureQueryParams {
    offset: number
    limit: number
    searchParams: string
    skipToken?: string
}
