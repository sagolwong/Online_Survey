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
    ADD_DRAFT_STEP3
} from "../actions/types";

let initialState = {
    projectId: "",
    sampleGroupId: "",
    nameSurvey: "",
    description: "",
    shareTo: "",
    wantName: false,
    haveGroup: false,
    names: [],
    frequency: {},
    doOnce: false,
    openAndCloseTimes: {},
    data: {},
    builtIns: [],
    status: "",
    step: 1
}
export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_STEP0:
            return {
                ...state,
                projectId: action.data.projectId,
                sampleGroupId: action.data.sampleGroupId
            };

        case ADD_STEP1:
            return {
                ...state,
                nameSurvey: action.data.surveyName,
                description: action.data.description,
                shareTo: action.data.shareTo,
                wantName: action.data.wantName,
                haveGroup: action.data.haveGroup,
                step: 2
            };

        case ADD_STEP2:
            return {
                ...state,
                data: action.formSurvey.data,
                builtIns: action.formSurvey.builtIns,
                step: 3
            };

        case ADD_STEP3:
            return {
                ...state,
                frequency: action.data.frequency,
                doOnce: action.data.doOnce,
                openAndCloseTimes: action.data.openAndCloseTimes,
                dateToDo: action.data.dateToDo,
                step: 4
            };

        case ADD_STEP4:
            return {
                ...state,
                status: action.data.status,
                step: 5
            };

        case ADD_DRAFT_STEP1:
            return {
                ...state,
                nameSurvey: action.data.surveyName,
                description: action.data.description,
                shareTo: action.data.shareTo,
                wantName: action.data.wantName,
                haveGroup: action.data.haveGroup,
                status: action.data.status,
                step: 5
            };

        case ADD_DRAFT_STEP2:
            return {
                ...state,
                data: action.formSurvey.data,
                builtIns: action.formSurvey.builtIns,
                status: action.formSurvey.status,
                step: 5
            };

        case ADD_DRAFT_STEP3:
            return {
                ...state,
                frequency: action.data.frequency,
                doOnce: action.data.doOnce,
                openAndCloseTimes: action.data.openAndCloseTimes,
                dateToDo: action.data.dateToDo,
                status: action.data.status,
                step: 5
            };

        case BACKTOSTEP1:
            return {
                ...state,
                step: 1
            };

        case BACKTOSTEP2:
            return {
                ...state,
                step: 2
            };

        case BACKTOSTEP3:
            return {
                ...state,
                comeFrom: "4-3",
                step: 3
            };

        default:
            return state;
    }
}