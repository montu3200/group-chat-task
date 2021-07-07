
const axios = require('axios');
var mangopay = require('mangopay2-nodejs-sdk');
const httpStatus = require('http-status');
const AppError = require('../../utils/AppError');
// /** Production */
// let MangopayCreds = {
//     clientId: 'pongopaymentsltdprod',
//     clientApiKey: 'K9ErenrQ5Rn3JD8Fqz882OiHEdNXwuxa4XE3U3gJhviFq3JwfX',
//     baseUrl: 'https://api.mangopay.com'
// }

/** Sandbox */
let MangopayCreds = {
    clientId: process.env.MANGO_CLIENT_ID,
    clientApiKey: process.env.MANGO_API_KEY,
    baseUrl: process.env.MANGO_BASE_URL
}

var api = new mangopay(MangopayCreds);

let MANGOPAY = {
    AUTH: `Basic ${Buffer.from((`${MangopayCreds.clientId}:${MangopayCreds.clientApiKey}`)).toString("base64")}`,
    URL: `${MangopayCreds.baseUrl}/v2.01/${MangopayCreds.clientId}/`
}

const createNaturalUser = async (params) => {
    let url = `${MANGOPAY.URL}users/natural`
    try {
        let response = await axios.post(url, params, { headers: { 'Authorization': MANGOPAY.AUTH } })
        return response.data

    } catch (err) {
        console.log(err)
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, "Your mangopay natural user is not created");
    }

};
const createLegalUser = async (params) => {
    let url = `${MANGOPAY.URL}users/legal`
    try {
        let response = await axios.post(url, params, { headers: { 'Authorization': MANGOPAY.AUTH } })
        return response.data

    } catch (err) {
        console.log(err)
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, "Your mangopay legal user is not created");
    }

};
const createBankAccount = async (params, customerId) => {
    let url = `${MANGOPAY.URL}users/${customerId}/bankaccounts/gb`
    try {
        let response = await axios.post(url, params, { headers: { 'Authorization': MANGOPAY.AUTH } })
        return response.data

    } catch (err) {
        console.log(err)
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, "Your mangopay bank account is not created");
    }

};
const createDeclaration = async (customerId) => {
    let url = `${MANGOPAY.URL}users/${customerId}/KYC/ubodeclarations`
    try {
        let response = await axios.post(url, {}, { headers: { 'Authorization': MANGOPAY.AUTH } })
        console.log("UBO declaration Created Successfully. =====>")
        return response.data

    } catch (err) {
        console.log(err)
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, "Your UBO declaration is not created");
    }

};
const createUBO = async (params, customerId, UboDeclarationId) => {
    let url = `${MANGOPAY.URL}users/${customerId}/KYC/ubodeclarations/${UboDeclarationId}/ubos`
    try {
        let response = await axios.post(url, params, { headers: { 'Authorization': MANGOPAY.AUTH } })
        console.log("UBO Created Successfully. =====>")
        return response.data

    } catch (err) {
        console.log(err)
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, "Your UBO is not created");
    }

};






module.exports = {
    createNaturalUser,
    createLegalUser,
    createBankAccount,
    createDeclaration,
    createUBO
};