import { BLANK_PAGE, SHOW_COMPONENT } from "../actions/types";


const initialState = {
    blankPage: true
};

export default function (state = initialState, action) {
    switch (action.type) {
        case BLANK_PAGE:
            return {
                blankPage: true
            };

        case SHOW_COMPONENT:
            return {
                blankPage: false
            };

        default:
            return state;
    }
}