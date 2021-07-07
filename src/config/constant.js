const ROLES = {
    ADMIN: 1,
    STAFF_MEMBERS: 2,
    CLIENT: 3,
    CUSTOMER: 4
};
const STATUS = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    DELETE: "Delete",
};
const ACCOUNT_TYPE = {
    INDIVIDUAL: 1,
    ORGANIZATION: 2
}
const TOKEN_TYPE = {
    ACCESS_TOKEN: 1,
    REFRESH_TOKEN: 2,
    VERIFICATION_TOKEN: 3,
    RESET_PASSWORD: 4,
};
const DEFAULT_IMAGE = { //https://res.cloudinary.com/zudu/image/upload/v1624276544/Yatapay/blank-profile.png
    URL: 'https://res.cloudinary.com/zudu/image/upload',
    DUMMYPROFILE: '/v1624276544/Yatapay/blank-profile.png'
}
const MILESTONESTATUS = {
    WAITING_ACCEPT: 1,
    PENDING: 2,
    // APPROVED: 3,
    CUSTOMER_REQ: 3,
    WAITING_FOR_CUST_PAYMENT: 4,
    PAYMENT_IN_DEPOSITE: 5,
    PAYMENT_REQ: 6,
    PAID: 7,
    COMPLETED: 8,
    DISPUTE_RAISED: 9,
    AWAITING_DISPUTE: 10,
    DISPUTE_RESOLVED: 11,
    IN_ARBITRATION: 12,
    CANCELLATION_REQ: 13
}

const JOBSTATUS = {
    CREATED: "CREATED", // Incomplete Payment Stages
    ACCEPT_JOB: "ACCEPT_JOB",  // Client = Waiting For Client to Accept Job, Customer = Waiting for You to Accept Job
    CUSTOMER_PAYMENT: "CUSTOMER_PAYMENT", // Client = Waiting For Client To Fund Deposit Box, Customer = Waiting For You To Fund Deposit Box
    PAYMENT_IN_DEPOSITE: "PAYMENT_IN_DEPOSITE", // Client = Payment In Deposit Box
    RELEASE_REQUESTED: "RELEASE_REQUESTED", // Client = Payment Release Requested 
    PAYMENT_RELEASE: "PAYMENT_RELEASE", // Client = Proccessing Payment Release
    NEXT_FUND: "NEXT_FUND", // Client = Waiting For Client to Fund Next Payment Stage, Customer = Waiting For You to Fund Next Payment Stage
    JOB_COMPLETE: "JOB_COMPLETE",
    PAYMENT_REJECTED: "PAYMENT_REJECTED",
    DISPUTE: "DISPUTE",
    PAID: "PAID",
}

module.exports = {
    ROLES,
    ACCOUNT_TYPE,
    TOKEN_TYPE,
    DEFAULT_IMAGE,
    STATUS
};
