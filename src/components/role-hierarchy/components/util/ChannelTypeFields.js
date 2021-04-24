export const FIELDS = [
    {
        groupId: 1,
        name: "Company Information",
        fields: {
            "1": {
                "name": "companyName",
                "placeholder": "Company Name",
                "label": "Company Name",
                "isMandatory": true,
                "minLength": 2,
                "maxLength": 40,
                "pattern": /^[a-zA-Z0-9' .-]*$/,
                "width": "sm"
            },
            "2": {
                "name": "comapnyTypeId",
                "placeholder": "Comapny Type",
                "label": "Comapny Type",
                "type": "1",
                "width": "sm"
            },
            "3": {
                "name": "businessRegNo",
                "placeholder": "Company Reg. No",
                "label": "Company Reg. No",
                "minLength": 2,
                "maxLength": 40,
                "pattern": /^[a-zA-Z0-9]*$/,
                "width": "sm"
            },
            "4": {
                "name": "taxNo",
                "placeholder": "Tax Identification No",
                "label": "Tax Identification No",
                "minLength": 2,
                "maxLength": 40,
                "pattern": /^[a-zA-Z0-9]*$/,
                "width": "sm"
            },
            "45": {
                "name": "erpCode",
                "placeholder": "ERP Code",
                "label": "ERP Code",
                "minLength": 1,
                "maxLength": 15,
                "pattern": /^[a-zA-Z0-9]*$/,
                "width": "sm"
            },
            "46": {
                "name": "serviceClassId",
                "placeholder": "Service Class",
                "label": "Service Class",
                "minLength": 1,
                "maxLength": 15,
                "type": "1",
                "width": "sm"
            },
            "47": {
                "name": "creditLimit",
                "placeholder": "eg: 1000.00",
                "label": "Credit Limit",
                "width": "sm",
                "minLength": 1,
                "maxLength": 20,
                "pattern": /^(-?)([0-9][0-9]*)(\.[0-9]+)?$/,
            },
            "53": {
                "name": "mobileNo",
                "placeholder": "09XXXXXXX",
                "label": "Mobile Number",
                "minLength": 1,
                "maxLength": 15,
                "pattern": /^[0-9]{8,15}$/,
                "width": "sm"
            },
            "54": {
                "name": "emailId",
                "placeholder": "johndoe@yourmail.com",
                "minLength": 1,
                "maxLength": 40,
                "pattern": /^[a-z0-9.\_%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/,
                "label": "Email Id",
                "width": "sm"
            }
        }
    },
    {
        groupId: 2,
        name: "Personal Information",
        subGroups: [
            {
                groupId: 3,
                name: "Authorised Person",
                fields: {
                    "22": {
                        "name": "authorizedPerson.emailId",
                        "placeholder": "someone@example.com",
                        "label": "Email address",
                        "minLength": 3,
                        "maxLength": 40,
                        "pattern": /^[a-z0-9.\_%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/,
                        "width": "sm"
                    },
                    "18": {
                        "name": "authorizedPerson.firstName",
                        "placeholder": "First Name",
                        "isMandatoryIfSelected": true,
                        "label": "First Name",
                        "minLength": 2,
                        "maxLength": 40,
                        "pattern": /^[a-zA-Z0-9' .-]*$/,
                        "width": "sm"
                    },
                    "19": {
                        "name": "authorizedPerson.lastName",
                        "placeholder": "Last name",
                        "label": "Last name",
                        "minLength": 1,
                        "maxLength": 40,
                        "pattern": /^[a-zA-Z0-9' .-]*$/,
                        "width": "sm"
                    },
                    "21": {
                        "name": "authorizedPerson.mobileNo",
                        "placeholder": "0XXXXXXXXXX",
                        "label": "Mobile Number",
                        "width": "sm",
                        "minLength": 3,
                        "maxLength": 10,
                        "pattern": /^[0-9]{3,10}$/
                    },
                    "20": {
                        "name": "authorizedPerson.phoneNo",
                        "placeholder": "0XXXXXXXXXX",
                        "label": "Phone number",
                        "width": "sm",
                        "minLength": 2,
                        "maxLength": 30,
                        "pattern": /^[0-9]{2,30}$/
                    },
                    "17": {
                        "name": "authorizedPerson.title",
                        "placeholder": "Mr/Mrs/Miss",
                        "label": "Title",
                        "isMandatoryIfSelected": true,
                        "width": "sm",
                        "type": "1",
                        "values": [{
                            value: "Mr",
                            label: "Mr"
                        },
                        {
                            value: "Mrs",
                            label: "Mrs"
                        },
                        {
                            value: "Miss",
                            label: "Miss"
                        }]
                    }
                }
            },
            {
                groupId: 4,
                name: "Contact Person",
                fields: {
                    "16": {
                        "name": "contactPerson.emailId",
                        "placeholder": "someone@example.com",
                        "label": "Email address",
                        "minLength": 3,
                        "maxLength": 40,
                        "pattern": /^[a-z0-9.\_%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/,
                        "width": "sm"
                    },
                    "12": {
                        "name": "contactPerson.firstName",
                        "placeholder": "First Name",
                        "isMandatoryIfSelected": true,
                        "label": "First Name",
                        "minLength": 2,
                        "maxLength": 40,
                        "pattern": /^[a-zA-Z0-9' .-]*$/,
                        "width": "sm"
                    },
                    "13": {
                        "name": "contactPerson.lastName",
                        "placeholder": "Last name",
                        "label": "Last name",
                        "minLength": 1,
                        "maxLength": 40,
                        "pattern": /^[a-zA-Z0-9' .-]*$/,
                        "width": "sm"
                    },
                    "15": {
                        "name": "contactPerson.mobileNo",
                        "placeholder": "0XXXXXXXXXX",
                        "label": "Mobile Number",
                        "width": "sm",
                        "minLength": 3,
                        "maxLength": 10,
                        "pattern": /^[0-9]{8,14}$/
                    },
                    "14": {
                        "name": "contactPerson.phoneNo",
                        "placeholder": "0XXXXXXXXXX",
                        "label": "Phone number",
                        "width": "sm",
                        "minLength": 2,
                        "maxLength": 30,
                        "pattern": /^[0-9]{8,14}$/
                    },
                    "11": {
                        "name": "contactPerson.title",
                        "placeholder": "Mr/Mrs/Miss",
                        "label": "Title",
                        "width": "sm",
                        "type": "1",
                        "isMandatoryIfSelected": true,
                        "values": [{
                            value: "Mr",
                            label: "Mr"
                        },
                        {
                            value: "Mrs",
                            label: "Mrs"
                        },
                        {
                            value: "Miss",
                            label: "Miss"
                        }]
                    }
                }
            }
        ]
    },
    {
        groupId: 5,
        name: "Address Information",
        subGroups: [
            {
                groupId: 7,
                name: "Registered Address",
                fields: {
                    "23": {
                        "name": "registeredAddress.addressLine1",
                        "placeholder": "Address Line1",
                        "label": "Address Line1",
                        "minLength": 2,
                        "maxLength": 40,
                        "pattern": /^[a-zA-Z0-9#,@$&\n\r _.-]*$/,
                        "width": "sm"
                    },
                    "24": {
                        "name": "registeredAddress.addressLine2",
                        "placeholder": "Address Line2",
                        "label": "Address Line2",
                        "minLength": 2,
                        "maxLength": 40,
                        "pattern": /^[a-zA-Z0-9#,@$&\n\r _.-]*$/,
                        "width": "sm"
                    },
                    "25": {
                        "name": "registeredAddress.city",
                        "placeholder": "City",
                        "label": "City",
                        "minLength": 1,
                        "maxLength": 40,
                        "pattern": /^[a-zA-Z0-9#,@$&\n\r _.-]*$/,
                        "width": "sm"
                    },
                    "26": {
                        "name": "registeredAddress.region",
                        "placeholder": "Region",
                        "label": "Region",
                        "minLength": 1,
                        "maxLength": 40,
                        "pattern": /^[a-zA-Z0-9#,@$&\n\r _.-]*$/,
                        "width": "sm"
                    },
                    "27": {
                        "name": "registeredAddress.zip",
                        "placeholder": "Zip",
                        "label": "Zip",
                        "minLength": 1,
                        "maxLength": 10,
                        "pattern": /^[0-9]{1,10}$/,
                        "width": "sm"
                    }
                }
            },
            {
                groupId: 13,
                name: "Billing Address",
                fields: {
                    "48": {
                        "name": "billingAddress.addressLine1",
                        "placeholder": "Address Line1",
                        "label": "Address Line1",
                        "minLength": 2,
                        "maxLength": 40,
                        "pattern": /^[a-zA-Z0-9#,@$&\n\r _.-]*$/,
                        "width": "sm"
                    },
                    "49": {
                        "name": "billingAddress.addressLine2",
                        "placeholder": "Address Line2",
                        "label": "Address Line2",
                        "minLength": 2,
                        "maxLength": 40,
                        "pattern": /^[a-zA-Z0-9#,@$&\n\r _.-]*$/,
                        "width": "sm"
                    },
                    "50": {
                        "name": "billingAddress.city",
                        "placeholder": "City",
                        "label": "City",
                        "minLength": 1,
                        "maxLength": 40,
                        "pattern": /^[a-zA-Z0-9#,@$&\n\r _.-]*$/,
                        "width": "sm"
                    },
                    "51": {
                        "name": "billingAddress.region",
                        "placeholder": "Region",
                        "label": "Region",
                        "minLength": 1,
                        "maxLength": 40,
                        "pattern": /^[a-zA-Z0-9#,@$&\n\r _.-]*$/,
                        "width": "sm"
                    },
                    "52": {
                        "name": "billingAddress.zip",
                        "placeholder": "Zip",
                        "label": "Zip",
                        "minLength": 1,
                        "maxLength": 10,
                        "pattern": /^[0-9]{1,10}$/,
                        "width": "sm"
                    }
                }
            },
            {
                groupId: 8,
                name: "Shipping Address",
                fields: {
                    "28": {
                        "name": "shippingAddress.addressLine1",
                        "placeholder": "Address Line1",
                        "label": "Address Line1",
                        "minLength": 2,
                        "maxLength": 40,
                        "pattern": /^[a-zA-Z0-9#,@$&\n\r _.-]*$/,
                        "width": "sm"
                    },
                    "29": {
                        "name": "shippingAddress.addressLine2",
                        "placeholder": "Address Line2",
                        "label": "Address Line2",
                        "minLength": 2,
                        "maxLength": 40,
                        "pattern": /^[a-zA-Z0-9#,@$&\n\r _.-]*$/,
                        "width": "sm"
                    },
                    "30": {
                        "name": "shippingAddress.city",
                        "placeholder": "City",
                        "label": "City",
                        "minLength": 1,
                        "maxLength": 40,
                        "pattern": /^[a-zA-Z0-9#,@$&\n\r _.-]*$/,
                        "width": "sm"
                    },
                    "31": {
                        "name": "shippingAddress.region",
                        "placeholder": "Region",
                        "label": "Region",
                        "minLength": 1,
                        "maxLength": 40,
                        "pattern": /^[a-zA-Z0-9#,@$&\n\r _.-]*$/,
                        "width": "sm"
                    },
                    "32": {
                        "name": "shippingAddress.zip",
                        "placeholder": "Zip",
                        "label": "Zip",
                        "width": "sm",
                        "minLength": 1,
                        "maxLength": 10,
                        "pattern": /^[0-9]{1,10}$/
                    }
                }
            },
            {
                groupId: 14,
                name: "Business Address",
                fields: {
                    "55": {
                        "name": "businessAddress.addressLine1",
                        "placeholder": "Address Line1",
                        "label": "Address Line1",
                        "minLength": 2,
                        "maxLength": 40,
                        "pattern": /^[a-zA-Z0-9#,@$&\n\r _.-]*$/,
                        "width": "sm"
                    },
                    "56": {
                        "name": "businessAddress.addressLine2",
                        "placeholder": "Address Line2",
                        "label": "Address Line2",
                        "minLength": 2,
                        "maxLength": 40,
                        "pattern": /^[a-zA-Z0-9#,@$&\n\r _.-]*$/,
                        "width": "sm"
                    },
                    "57": {
                        "name": "businessAddress.city",
                        "placeholder": "City",
                        "label": "City",
                        "minLength": 1,
                        "maxLength": 40,
                        "pattern": /^[a-zA-Z0-9#,@$&\n\r _.-]*$/,
                        "width": "sm"
                    },
                    "58": {
                        "name": "businessAddress.region",
                        "placeholder": "Region",
                        "label": "Region",
                        "minLength": 1,
                        "maxLength": 40,
                        "pattern": /^[a-zA-Z0-9#,@$&\n\r _.-]*$/,
                        "width": "sm"
                    },
                    "59": {
                        "name": "businessAddress.zip",
                        "placeholder": "Zip",
                        "label": "Zip",
                        "width": "sm",
                        "minLength": 1,
                        "maxLength": 10,
                        "pattern": /^[0-9]{1,10}$/
                    }
                }
            }
        ]
    },
    {
        groupId: 10,
        name: "Bank Details",
        fields: {
            "37": {
                "name": "bankName",
                "placeholder": "Bank Name",
                "label": "Bank Name",
                "minLength": 2,
                "maxLength": 40,
                "pattern": /^[a-zA-Z0-9#,@$&\n\r _.-]*$/,
                "width": "sm"
            },
            "38": {
                "name": "branchName",
                "placeholder": "Branch Name",
                "label": "Branch Name",
                "minLength": 2,
                "maxLength": 40,
                "pattern": /^[a-zA-Z0-9#,@$&\n\r _.-]*$/,
                "width": "sm"
            },
            "39": {
                "name": "bankAccountNo.",
                "placeholder": "Bank Account No.",
                "label": "Bank Account No.",
                "minLength": 2,
                "maxLength": 40,
                "pattern": /^[a-zA-Z0-9]*$/,
                "width": "sm"
            },
            "40": {
                "name": "swiftCode",
                "placeholder": "Swift Code",
                "label": "Swift Code",
                "minLength": 2,
                "maxLength": 40,
                "pattern": /^[a-zA-Z0-9]*$/,
                "width": "sm"
            }
        }
    },
    
    {
        groupId: 9,
        name: "Business Location",
        fields: {
            "33": {
                "name": "territoryType",
                "placeholder": "Territory Type",
                "isMandatory": true,
                "label": "Territory Type",
                "type": "1",
                "width": "sm"
            },
            "34": {
                "name": "territoryName",
                "placeholder": "Territory Name",
                "isMandatory": true,
                "label": "Territory Name",
                "width": "sm"
            },
            "35": {
                "name": "latitude",
                "placeholder": "Lattitude",
                "label": "Lattitude",
                "minLength": 1,
                "maxLength": 50,
                "pattern": /^(-?)([0-9][0-9]*)(\.[0-9]+)?$/,
                "width": "sm"
            },
            "36": {
                "name": "longitude",
                "placeholder": "Longitude",
                "label": "Longitude",
                "minLength": 1,
                "maxLength": 50,
                "pattern": /^(-?)([0-9][0-9]*)(\.[0-9]+)?$/,
                "width": "sm"
            }
        }
    }
    
]


export const BUSINESS_LOCATION_GROUP = {
    GROUPID: 9,
    FIELDID_TERRITORYTYPE: 33,
    FIELDID_TERRITORYNAME: 34,
    FIELDID_LATTITUDE: 35,
    FIELDID_LONGITUDE: 36,
    FIELDNAME_TERRITORYTYPE: 'territoryType'
} ;

export const PERSONAL_DETAILS_GROUP = {
    AUTHORISED_PERSON_GROUPID: 3,
    CONTACT_PERSON_GROUPID: 4
} ;
