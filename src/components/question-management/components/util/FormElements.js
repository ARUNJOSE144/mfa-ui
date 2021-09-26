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
        label: "Question Keys  Contains",
        width: "md",
        ismandatory: false,
        type: FIELD_TYPES.TEXT
    },
    "searchQuestion": {
        name: "searchQuestion",
        label: "Question   Contains",
        width: "md",
        ismandatory: false,
        type: FIELD_TYPES.TEXT
    },
    "searchAnswer": {
        name: "searchAnswer",
        label: "Answer   Contains",
        width: "md",
        ismandatory: false,
        type: FIELD_TYPES.TEXT
    },
    "searchSubject": {
        name: "searchSubject",
        label: "Subject",
        width: "md",
        ismandatory: false,
        type: FIELD_TYPES.MUTLI_SELECT
    },
    "searchQuestionName": {
        name: "searchQuestionName",
        label: "Question Name  Contains",
        width: "md",
        ismandatory: false,
        type: FIELD_TYPES.TEXT
    }, "searchQuestionFrom": {
        name: "searchQuestionFrom",
        label: "Question From",
        width: "md",
        ismandatory: false,
        "type": FIELD_TYPES.MUTLI_SELECT,
    },
    "searchHavingAnswer": {
        name: "searchHavingAnswer",
        label: "Having Answer",
        width: "md",
        ismandatory: false,
        "type": FIELD_TYPES.DROP_DOWN,
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
    }, "rowCount": {
        name: "rowCount",
        label: "Max No.Of Questions",
        customWidth: true,
        width: "xs:3",
        ismandatory: false,
        "type": FIELD_TYPES.TEXT
    }, "bookmark": {
        name: "bookmark",
        label: "Bookmarked",
        width: "md",
        ismandatory: false,
        "type": FIELD_TYPES.DROP_DOWN,
    }

};
