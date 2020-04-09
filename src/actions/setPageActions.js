import { BLANK_PAGE, SHOW_COMPONENT } from "./types";

// Set Blank Page
export const setBlankPage = () => {
    return {
        type: BLANK_PAGE
    }
}

// Show Component
export const showComponent = () => {
    return {
        type: SHOW_COMPONENT
    }
}
