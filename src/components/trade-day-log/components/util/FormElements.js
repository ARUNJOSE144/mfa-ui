import FIELD_TYPES from '../../../generic/fields/elements/fieldItem/FieldTypes';


export const ROLES = {
    "tradeDayId": {
        name: "tradeDayId",
        placeholder: "Trade Day Id",
        label: "Trade Day Id",
        width: "sm",
        type: FIELD_TYPES.TEXT
    },
    "tradeDate": {
        name: "tradeDate",
        placeholder: "Trade Date",
        label: "Trade Date",
        width: "sm",
        ismandatory: true,
        type: FIELD_TYPES.DATE_PICKER
    },
    "comments": {
        name: "comments",
        placeholder: "Comments",
        label: "Comments",
        width: "md",
        ismandatory: false,
        type: FIELD_TYPES.TEXT_AREA
    },
    "symbol": {
        name: "symbol",
        placeholder: "Symbol",
        label: "Symbol",
        width: "md",
        ismandatory: true,
        "type": FIELD_TYPES.DROP_DOWN,
        "placeholder": "Select",
    },
    "indiaVix": {
        name: "indiaVix",
        placeholder: "IndiaVix",
        label: "IndiaVix",
        width: "md",
        ismandatory: false,
        "type": FIELD_TYPES.TEXT,
    },
    "preOpen": {
        name: "preOpen",
        placeholder: "Pre-Open",
        label: "Pre-Open",
        width: "md",
        ismandatory: true,
        "type": FIELD_TYPES.DROP_DOWN,
        "placeholder": "Select",
    },
    "firstHalf": {
        name: "firstHalf",
        placeholder: "First Half",
        label: "First Half",
        width: "md",
        ismandatory: true,
        "type": FIELD_TYPES.DROP_DOWN,
        "placeholder": "Select",
    },
    "secondHalf": {
        name: "secondHalf",
        placeholder: "Second Half",
        label: "Second Half",
        width: "md",
        ismandatory: true,
        "type": FIELD_TYPES.DROP_DOWN,
        "placeholder": "Select",
    },
    "events": {
        name: "events",
        placeholder: "Events",
        label: "Events",
        width: "md",
        ismandatory: false,
        "type": FIELD_TYPES.MUTLI_SELECT,
        "placeholder": "Select",
    }, "symbolComments": {
        name: "symbolComments",
        placeholder: "Comments",
        label: "Comments",
        width: "md",
        ismandatory: false,
        type: FIELD_TYPES.TEXT_AREA
    },













    "searchTradeDate": {
        name: "searchTradeDate",
        label: "Trade Date",
        width: "md",
        ismandatory: false,
        type: FIELD_TYPES.DATE_PICKER
    },
    "searchDay": {
        name: "searchDay",
        label: "Day",
        width: "md",
        ismandatory: false,
        type: FIELD_TYPES.MUTLI_SELECT
    },
    "searchDate": {
        name: "searchDate",
        label: "Search Date",
        width: "md",
        ismandatory: false,
        type: FIELD_TYPES.MUTLI_SELECT  
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
