export const ModuleList = [
  {
    "id" : 1,
    "name" : "Employee",
    "features" : [
      {
        "id" : 11,
        "name" : "Create",
        "fields" : [
          1, 2
        ]
      },
      {
        "id" : 12,
        "name" : "Edit",
        "fields" : [
          3, 4
        ]
      }
    ]
  }
]

export const Fields = {
  1 : {
    "name" : "User Name",
    "value" : "",
    "conditions" : [
      1,2,3
    ]
  },
  2 : {
    "name" : "Mobile Number",
    "value" : "",
    "conditions" : [
      1,2,3
    ]
  },
  3 : {
    "name" : "Status",
    "type" : 1,
    "value" : [
      {"value" : 1, "label" : "Active"},
      {"value" : 0, "label" : "inActive"}
    ],
    "conditions" : [
      1,4,5
    ]
  },
  4 : {
    "name" : "User Type",
    "type" : 1,
    "url" : "http://10.0.0.36:8193/SalesAndDistribution_API/v1/userTypes",
    "conditions" : [
      1,2,3,4,5
    ]
  }
}

export const Conditions = {
  1: {
    "label" : "Equals",
    "showData" : true
  },
  2 : {
    "label" : "<",
    "showData" : true
  },
  3 : {
    "label" : ">",
    "showData" : true
  },
  4 : {
    "label" : "Is Empty"
  },
  5 : {
    "label" : "Is Not Empty"
  }
}
