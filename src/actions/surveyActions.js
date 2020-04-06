import {
    ADD_STEP0,
    ADD_STEP1,
    ADD_STEP2,
    ADD_STEP3,
    ADD_STEP4,
    BACKTOSTEP1,
    BACKTOSTEP2,
    BACKTOSTEP3,
    ADD_DRAFT_STEP1,
    ADD_DRAFT_STEP2,
    ADD_DRAFT_STEP3,
    EDIT_STEP0,
    EDIT_STEP1,
    EDIT_STEP2,
    EDIT_DRAFT_STEP1,
    BACKTOEDITSTEP1
} from "./types";

export const addStep0 = data => {
    return {
        type: ADD_STEP0,
        data: data
    }
}

export const addStep1 = data => {
    return {
        type: ADD_STEP1,
        data: data
    }
}

export const addStep2 = formSurvey => {
    return {
        type: ADD_STEP2,
        formSurvey: formSurvey
    }
}

export const addStep3 = data => {
    return {
        type: ADD_STEP3,
        data: data
    }
}

export const addStep4 = data => {
    return {
        type: ADD_STEP4,
        data: data
    }
}

export const addDraftStep1 = data => {
    return {
        type: ADD_DRAFT_STEP1,
        data: data
    }
}

export const addDraftStep2 = formSurvey => {
    return {
        type: ADD_DRAFT_STEP2,
        formSurvey: formSurvey
    }
}

export const addDraftStep3 = data => {
    return {
        type: ADD_DRAFT_STEP3,
        data: data
    }
}

export const backToStep1 = () => {
    return {
        type: BACKTOSTEP1
    }
}

export const backToStep2 = () => {
    return {
        type: BACKTOSTEP2
    }
}

export const backToStep3 = () => {
    return {
        type: BACKTOSTEP3
    }
}

//edit survey
export const editStep0 = data => {
    return {
        type: EDIT_STEP0,
        data: data
    }
}

export const editStep1 = data => {
    return {
        type: EDIT_STEP1,
        data: data
    }
}

export const editStep2 = data => {
    return {
        type: EDIT_STEP2,
        data: data
    }
}

export const editDraftStep1 = data => {
    return {
        type: EDIT_DRAFT_STEP1,
        data: data
    }
}

export const backToEditStep1 = data => {
    return {
        type: BACKTOEDITSTEP1
    }
}