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
} from "../actions/types";

let initialState = {
    userId: "",
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
                userId: action.data.userId,
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

        // edit survey
        case EDIT_STEP0:
            return {
                ...state,
                userId: action.data.userId,
                projectId: action.data.projectId,
                sampleGroupId: action.data.sampleGroupId,
                nameSurvey: action.data.nameSurvey,
                description: action.data.description,
                shareTo: action.data.shareTo,
                wantName: action.data.wantName,
                haveGroup: action.data.haveGroup,
                frequency: action.data.frequency,
                doOnce: action.data.doOnce,
                openAndCloseTimes: action.data.openAndCloseTimes,
                data: action.data.data,
                builtIns: action.data.builtIns,
                dateToDo: [],
                status: action.data.status,
                step: "e1"
            };

        case EDIT_STEP1:
            return {
                ...state,
                nameSurvey: action.data.nameSurvey,
                description: action.data.description,
                shareTo: action.data.shareTo,
                wantName: action.data.wantName,
                haveGroup: action.data.haveGroup,
                frequency: action.data.frequency,
                doOnce: action.data.doOnce,
                openAndCloseTimes: action.data.openAndCloseTimes,
                data: action.data.data,
                builtIns: action.data.builtIns,
                dateToDo: action.data.dateToDo,
                status: action.data.status,
                step: "e2"
            };

        case EDIT_STEP2:
            return {
                ...state,
                status: action.data.status,
                step: "e3"
            };

        case EDIT_DRAFT_STEP1:
            return {
                ...state,
                nameSurvey: action.data.nameSurvey,
                description: action.data.description,
                shareTo: action.data.shareTo,
                wantName: action.data.wantName,
                haveGroup: action.data.haveGroup,
                frequency: action.data.frequency,
                doOnce: action.data.doOnce,
                openAndCloseTimes: action.data.openAndCloseTimes,
                data: action.data.data,
                builtIns: action.data.builtIns,
                dateToDo: action.data.dateToDo,
                status: action.data.status,
                step: "e3"
            };

        case BACKTOEDITSTEP1:
            return {
                ...state,
                step: "e1"
            };

        default:
            return state;
    }
}