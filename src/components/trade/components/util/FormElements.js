import FIELD_TYPES from '../../../generic/fields/elements/fieldItem/FieldTypes';


export const ROLES = {
    "tradeId": {
        name: "tradeId",
        placeholder: "Trade Id",
        label: "Trade Id",
        width: "sm",
        type: FIELD_TYPES.TEXT
    },
    "symbol": {
        name: "symbol",
        placeholder: "Symbol",
        label: "symbol",
        width: "sm",
        ismandatory: true,
        type: FIELD_TYPES.DROP_DOWN
    },
    "strike": {
        name: "strike",
        placeholder: "strike",
        label: "strike",
        width: "sm",
        ismandatory: true,
        type: FIELD_TYPES.DROP_DOWN
    },
    "type": {
        name: "type",
        placeholder: "Type",
        label: "Type",
        width: "md",
        ismandatory: true,
        type: FIELD_TYPES.DROP_DOWN
    },
    "side": {
        name: "side",
        placeholder: "side",
        label: "Side",
        width: "md",
        ismandatory: true,
        "type": FIELD_TYPES.DROP_DOWN,
        "placeholder": "Side",
    },
    "aboveOrBelow": {
        name: "aboveOrBelow",
        placeholder: "Above Or Below",
        label: "Above Or Below",
        width: "md",
        ismandatory: true,
        "type": FIELD_TYPES.DROP_DOWN,
        "placeholder": "Above Or Below",
    },
    "price": {
        name: "price",
        placeholder: "Price",
        label: "Price",
        width: "md",
        ismandatory: true,
        "type": FIELD_TYPES.TEXT,
    },
    "profitPrice": {
        name: "profitPrice",
        placeholder: "Profit Price",
        label: "Profit Price",
        width: "md",
        ismandatory: true,
        "type": FIELD_TYPES.TEXT,
    },
    "slPrice": {
        name: "slPrice",
        placeholder: "SL Price",
        label: "SL Price",
        width: "md",
        ismandatory: true,
        "type": FIELD_TYPES.TEXT,
    }, "qty": {
        name: "qty",
        placeholder: "Quantity",
        label: "Quantity",
        width: "md",
        ismandatory: true,
        "type": FIELD_TYPES.TEXT,
    }




};
