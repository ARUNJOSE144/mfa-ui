import FIELD_TYPES from '../../../generic/fields/elements/fieldItem/FieldTypes';


export const ROLES = {
    "roleId": {
        name: "roleId",
        placeholder: "Role Id",
        label: "Role Id",
        width: "sm",
        type: FIELD_TYPES.TEXT
    },
    "questionName": {
        name: "questionName",
        placeholder: "Question Name",
        label: "Question Name",
        width: "sm",
        ismandatory: true,
        type: FIELD_TYPES.TEXT
    }
    ,
    "questionKey": {
        name: "questionKey",
        placeholder: "Question Keys ",
        label: "Question Keys ",
        width: "md",
        ismandatory: true,
        type: FIELD_TYPES.TEXT_AREA
    },
    "question": {
        name: "question",
        placeholder: "Question  ",
        label: "Question  ",
        width: "md",
        ismandatory: true,
        type: FIELD_TYPES.TEXT_AREA
    },
    "answer": {
        name: "answer",
        placeholder: "answer  ",
        label: "answer  ",
        width: "md",
        ismandatory: false,
        type: FIELD_TYPES.TEXT_AREA
    },
    "questionFrom": {
        name: "questionFrom",
        placeholder: "Question From  ",
        label: "Question From  ",
        width: "md",
        ismandatory: true,
        "type": FIELD_TYPES.DROP_DOWN,
        "placeholder": "Select",
    }
    ,
    "subject": {
        name: "subject",
        placeholder: "Subject",
        label: "Subject",
        width: "md",
        ismandatory: false,
        "type": FIELD_TYPES.DROP_DOWN,
        "placeholder": "Select",
    }





    ,
    "searchQuestionKey": {
        name: "searchQuestionKey",
        placeholder: "Question Keys Contains",
        label: "Question Keys  Contains",
        width: "md",
        ismandatory: true,
        type: FIELD_TYPES.TEXT
    },
    "searchQuestion": {
        name: "searchQuestion",
        placeholder: "Question   Contains",
        label: "Question   Contains",
        width: "md",
        ismandatory: true,
        type: FIELD_TYPES.TEXT
    },
    "searchAnswer": {
        name: "searchAnswer",
        placeholder: "Answer   Contains",
        label: "Answer   Contains",
        width: "md",
        ismandatory: true,
        type: FIELD_TYPES.TEXT
    },
    "searchSubject": {
        name: "searchSubject",
        placeholder: "Search Subject",
        label: "Search Subject",
        width: "md",
        ismandatory: true,
        type: FIELD_TYPES.DROP_DOWN
    },


    


    "searchQuestionName": {
        name: "searchQuestionName",
        placeholder: "Question Name   Contains",
        label: "Question Name  Contains",
        width: "md",
        ismandatory: true,
        type: FIELD_TYPES.TEXT
    }, "searchQuestionFrom": {
        name: "searchQuestionFrom",
        placeholder: "Search Question From",
        label: "Search Question From",
        width: "md",
        ismandatory: true,
        "type": FIELD_TYPES.DROP_DOWN,
        "placeholder": "Select",
    },
    "searchHavingAnswer": {
        name: "searchHavingAnswer",
        placeholder: "Having Answer",
        label: "Having Answer",
        width: "md",
        ismandatory: true,
        "type": FIELD_TYPES.DROP_DOWN,
        "placeholder": "Select",
    }



    , "showQuestion": {
        name: "showQuestion",
        placeholder: "Question  ",
        label: "Question  ",
        width: "sm",
        ismandatory: true,
        type: FIELD_TYPES.TEXT_AREA
    },
    "showAnswer": {
        name: "showAnswer",
        placeholder: "answer  ",
        label: "answer  ",
        width: "md",
        ismandatory: true,
        type: FIELD_TYPES.TEXT_AREA
    }

};
