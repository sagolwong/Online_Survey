import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from 'react-redux';

import { editDraftStep1, editStep1 } from "../actions/surveyActions";

import * as SurveyJSCreator from "survey-creator";
import * as SurveyKo from "survey-knockout";
import "survey-creator/survey-creator.css";

import "jquery-ui/themes/base/all.css";
import "nouislider/distribute/nouislider.css";
import "select2/dist/css/select2.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";

import "jquery-bar-rating/dist/themes/css-stars.css";
import "jquery-bar-rating/dist/themes/fontawesome-stars.css";

import $ from "jquery";
import "jquery-ui/ui/widgets/datepicker.js";
import "select2/dist/js/select2.js";
import "jquery-bar-rating";

import "icheck/skins/square/blue.css";

import * as widgets from "surveyjs-widgets";

SurveyJSCreator.StylesManager.applyTheme("default");

widgets.icheck(SurveyKo, $);
widgets.select2(SurveyKo, $);
widgets.inputmask(SurveyKo);
widgets.jquerybarrating(SurveyKo, $);
widgets.jqueryuidatepicker(SurveyKo, $);
widgets.nouislider(SurveyKo);
widgets.select2tagbox(SurveyKo, $);
widgets.signaturepad(SurveyKo);
widgets.sortablejs(SurveyKo);
widgets.ckeditor(SurveyKo);
widgets.autocomplete(SurveyKo, $);
widgets.bootstrapslider(SurveyKo);

class EditSurvey extends Component {
    constructor(props) {
        super(props);

        this.onChangeShareTo = this.onChangeShareTo.bind(this);
        this.onChangeWantName = this.onChangeWantName.bind(this);
        this.onChangeHaveGroup = this.onChangeHaveGroup.bind(this);
        this.onChangeBuiltInWidgetGender = this.onChangeBuiltInWidgetGender.bind(this);
        this.onChangeBuiltInWidgetAges = this.onChangeBuiltInWidgetAges.bind(this);
        this.onChangeBuiltInWidgetStatus = this.onChangeBuiltInWidgetStatus.bind(this);
        this.onChangeBuiltInWidgetEducation = this.onChangeBuiltInWidgetEducation.bind(this);
        this.onChangeBuiltInWidgetJob = this.onChangeBuiltInWidgetJob.bind(this);
        this.onChangeBuiltInWidgetIncome = this.onChangeBuiltInWidgetIncome.bind(this);
        this.onChangeAmount = this.onChangeAmount.bind(this);
        this.onChangeUnitTime = this.onChangeUnitTime.bind(this);
        this.onChangeSetFreq = this.onChangeSetFreq.bind(this);
        this.onChangeDoOnce = this.onChangeDoOnce.bind(this);
        this.onChangeDoMany = this.onChangeDoMany.bind(this);
        this.onChangeStartMonth = this.onChangeStartMonth.bind(this);
        this.onChangeEndMonth = this.onChangeEndMonth.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.sendData = this.sendData.bind(this);

        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear() + 543;


        this.state = {
            nameSurvey: "",
            description: "",
            shareTo: "",
            wantName: false,
            haveGroup: false,
            builtInWidgetGender: false,
            builtInWidgetAges: false,
            builtInWidgetStatus: false,
            builtInWidgetEducation: false,
            builtInWidgetJob: false,
            builtInWidgetIncome: false,
            frequency: {
                amount: 0,
                unitsOfTime: ""
            },
            dateToDo: [],
            setFreq: false,
            checkHaveGroup: false,
            doOnce: false,
            doMany: false,
            schedule: false,
            startDate: date,
            startMonth: month,
            startYear: year,
            endDate: date,
            endMonth: month,
            endYear: year + 1,
            sDate: date,
            sMonth: month,
            sYear: year,
            eDate: date,
            eMonth: month,
            eYear: year + 1
        };
    }

    surveyCreator;

    componentDidMount() {
        this.setState({ schedule: true })

        if (this.props.survey.nameSurvey !== "") this.setState({ nameSurvey: this.props.survey.nameSurvey })
        if (this.props.survey.description !== "") this.setState({ description: this.props.survey.description })
        if (this.props.survey.shareTo !== "") this.setState({ shareTo: this.props.survey.shareTo })
        if (this.props.survey.wantName !== "") this.setState({ wantName: this.props.survey.wantName })
        if (this.props.survey.haveGroup !== "") this.setState({ haveGroup: this.props.survey.haveGroup })
        if (this.props.survey.openAndCloseTimes !== undefined) {
            this.setState({
                startDate: this.props.survey.openAndCloseTimes.start.day,
                startMonth: this.props.survey.openAndCloseTimes.start.month,
                startYear: this.props.survey.openAndCloseTimes.start.year,
                endDate: this.props.survey.openAndCloseTimes.end.day,
                endMonth: this.props.survey.openAndCloseTimes.end.month,
                endYear: this.props.survey.openAndCloseTimes.end.year,
            })
        }

        this.props.survey.builtIns.map(widget => {
            if (widget.builtInWidget === "gender") this.setState({ builtInWidgetGender: true })
            else if (widget.builtInWidget === "ages") this.setState({ builtInWidgetAges: true })
            else if (widget.builtInWidget === "status") this.setState({ builtInWidgetStatus: true })
            else if (widget.builtInWidget === "education") this.setState({ builtInWidgetEducation: true })
            else if (widget.builtInWidget === "job") this.setState({ builtInWidgetJob: true })
            else if (widget.builtInWidget === "income") this.setState({ builtInWidgetIncome: true })
        })

        if (this.props.survey.doOnce) {
            this.setState({
                doOnce: true,
                setFreq: false
            })
        } else {
            if (this.props.survey.frequency !== undefined) {
                if (this.props.survey.frequency.amount !== 0) {
                    this.setState({
                        doOnce: false,
                        setFreq: true,
                        frequency: {
                            amount: this.props.survey.frequency.amount,
                            unitsOfTime: this.props.survey.frequency.unitsOfTime
                        }
                    })
                } else {
                    this.setState({
                        doOnce: false,
                        setFreq: false,
                        doMany: true
                    })
                }
            }

        }

        let options = { showEmbededSurveyTab: false };
        this.surveyCreator = new SurveyJSCreator.SurveyCreator(
            "surveyCreatorContainer",
            options
        );
        this.surveyCreator.saveSurveyFunc = this.saveMySurvey;
        console.log(JSON.parse(JSON.stringify(this.surveyCreator.text)));
        if (this.props.survey.data !== undefined) {
            if (this.props.survey.data[0] !== undefined) {
                window.localStorage.setItem("LocalStorageSurvey", this.props.survey.data);
                this.surveyCreator.text = window.localStorage.getItem("LocalStorageSurvey") || "";
            }
            console.log(window.localStorage.getItem("LocalStorageSurvey") || "");
            window.localStorage.removeItem("LocalStorageSurvey");
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.checkHaveGroup !== this.state.checkHaveGroup) {
            this.setState({
                setFreq: false,
                frequency: {
                    amount: 0,
                    unitsOfTime: ""
                }
            })
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    }

    onChangeShareTo(e) {
        if (e.target.value === "PUBLIC") {
            this.setState({
                haveGroup: false,
                checkHaveGroup: !this.state.checkHaveGroup
            })
        }
        this.setState({
            shareTo: e.target.value
        })
    }

    onChangeWantName() {
        this.setState({
            wantName: !this.state.wantName
        })
    }

    onChangeHaveGroup() {
        this.setState({
            haveGroup: !this.state.haveGroup,
            checkHaveGroup: !this.state.checkHaveGroup
        })
    }

    onChangeBuiltInWidgetGender() {
        this.setState({
            builtInWidgetGender: !this.state.builtInWidgetGender
        })
    }

    onChangeBuiltInWidgetAges() {
        this.setState({
            builtInWidgetAges: !this.state.builtInWidgetAges
        })
    }

    onChangeBuiltInWidgetStatus() {
        this.setState({
            builtInWidgetStatus: !this.state.builtInWidgetStatus
        })
    }

    onChangeBuiltInWidgetEducation() {
        this.setState({
            builtInWidgetEducation: !this.state.builtInWidgetEducation
        })
    }
    onChangeBuiltInWidgetJob() {
        this.setState({
            builtInWidgetJob: !this.state.builtInWidgetJob
        })
    }

    onChangeBuiltInWidgetIncome() {
        this.setState({
            builtInWidgetIncome: !this.state.builtInWidgetIncome
        })
    }

    onChangeAmount(e) {
        this.setState({
            frequency: {
                amount: e.target.value,
                unitsOfTime: this.state.frequency.unitsOfTime
            }
        })
    }
    onChangeUnitTime(e) {
        this.setState({
            frequency: {
                amount: this.state.frequency.amount,
                unitsOfTime: e.target.value
            }
        })
    }

    onChangeSetFreq() {
        this.setState({
            setFreq: !this.state.setFreq,
            schedule: !this.state.schedule,
            doOnce: false,
            doMany: false
        })
    }

    onChangeDoOnce() {
        if (this.state.setFreq) {
            this.setState({
                doOnce: true,
                setFreq: false,
                schedule: false,
                doMany: false,
                frequency: {
                    amount: 0,
                    unitsOfTime: ""
                }
            })
        } else {
            this.setState({
                doOnce: true,
                setFreq: false,
                doMany: false,
                frequency: {
                    amount: 0,
                    unitsOfTime: ""
                }
            })
        }
    }

    onChangeDoMany() {
        if (this.state.setFreq) {
            this.setState({
                doOnce: false,
                setFreq: false,
                schedule: false,
                doMany: true,
                frequency: {
                    amount: 0,
                    unitsOfTime: ""
                }
            })
        } else {
            this.setState({
                doOnce: false,
                setFreq: false,
                doMany: true,
                frequency: {
                    amount: 0,
                    unitsOfTime: ""
                }
            })
        }
    }

    onChangeStartMonth(e) {
        this.setState({
            startMonth: e.target.value
        })
    }

    onChangeEndMonth(e) {
        this.setState({
            endMonth: e.target.value
        })
    }

    saveDraft() {
        const start = {
            day: Number(this.state.startDate),
            month: Number(this.state.startMonth),
            year: Number(this.state.startYear)
        }
        const end = {
            day: Number(this.state.endDate),
            month: Number(this.state.endMonth),
            year: Number(this.state.endYear)
        }
        console.log(start);
        console.log(end);
        const openAndCloseTimes = {
            start,
            end
        }

        let builtIns = [];
        var data = {};

        if (this.state.builtInWidgetGender) {
            builtIns = builtIns.concat({ builtInWidget: "gender" })
        }
        if (this.state.builtInWidgetAges) {
            builtIns = builtIns.concat({ builtInWidget: "ages" })
        }
        if (this.state.builtInWidgetStatus) {
            builtIns = builtIns.concat({ builtInWidget: "status" })
        }
        if (this.state.builtInWidgetEducation) {
            builtIns = builtIns.concat({ builtInWidget: "education" })
        }
        if (this.state.builtInWidgetJob) {
            builtIns = builtIns.concat({ builtInWidget: "job" })
        }
        if (this.state.builtInWidgetIncome) {
            builtIns = builtIns.concat({ builtInWidget: "income" })
        }
        console.log(builtIns)

        if (builtIns[0] !== undefined) {
            data = {
                nameSurvey: this.state.nameSurvey,
                description: this.state.description,
                shareTo: this.state.shareTo,
                wantName: this.state.wantName,
                haveGroup: this.state.haveGroup,
                data: JSON.parse(JSON.stringify(this.surveyCreator.text)),
                builtIns: builtIns,
                frequency: this.state.frequency,
                doOnce: this.state.doOnce,
                openAndCloseTimes: openAndCloseTimes,
                status: "DRAFT"
            }
        } else {
            data = {
                nameSampleGroup: this.state.nameSampleGroup,
                nameSurvey: this.state.nameSurvey,
                description: this.state.description,
                shareTo: this.state.shareTo,
                wantName: this.state.wantName,
                haveGroup: this.state.haveGroup,
                data: JSON.parse(JSON.stringify(this.surveyCreator.text)),
                frequency: this.state.frequency,
                doOnce: this.state.doOnce,
                openAndCloseTimes: openAndCloseTimes,
                status: "DRAFT"

            }
        }
        this.props.editDraftStep1(data);
    }

    onSubmit() {
        const start = {
            day: Number(this.state.startDate),
            month: Number(this.state.startMonth),
            year: Number(this.state.startYear)
        }
        const end = {
            day: Number(this.state.endDate),
            month: Number(this.state.endMonth),
            year: Number(this.state.endYear)
        }
        console.log(start);
        console.log(end);

        if (this.state.setFreq && Number(this.state.frequency.amount) !== 0 && this.state.frequency.unitsOfTime !== "") {
            //set date for frequency
            let f = 0;
            if (this.state.frequency.unitsOfTime === "day") f = this.state.frequency.amount;
            else if (this.state.frequency.unitsOfTime === "week") f = this.state.frequency.amount * 7;
            else if (this.state.frequency.unitsOfTime === "month") f = this.state.frequency.amount * 30;
            else if (this.state.frequency.unitsOfTime === "year") f = this.state.frequency.amount * 365;
            console.log(f);

            let nF = 0;
            if (start.month !== end.month && start.year === end.year) {
                for (let i = start.month; i <= end.month; i++) {
                    console.log("i=" + i);
                    if (i === end.month) {
                        nF = nF + end.day;
                        console.log("1.1=" + nF);
                    }
                    else if ((i === start.month) && (i === 1 || i === 3 || i === 5 || i === 7 || i === 8 || i === 10 || i === 12)) {
                        nF = 31 - (start.day - 1);
                        console.log("1.2=" + nF);
                    }
                    else if (i === 1 || i === 3 || i === 5 || i === 7 || i === 8 || i === 10 || i === 12) {
                        nF += 31;
                        console.log("1.3")
                    }
                    else if (i === start.month && (i === 4 || i === 6 || i === 9 || i === 11)) {
                        nF = 30 - (start.day - 1);
                        console.log("1.4")
                    }
                    else if (i === 4 || i === 6 || i === 9 || i === 11) {
                        nF += 30;
                        console.log("1.5")
                    }
                    else if (i === start.month && i === 2) {
                        if ((start.year - 543) % 4 === 0 || ((start.year - 543) % 4 === 0 && (start.year - 543) % 100 === 0 && (start.year - 543) % 400 === 0)) {
                            nF = 29 - (start.day - 1);
                            console.log("1.6=" + nF)
                        }
                        else {
                            nF = 28 - (start.day - 1);
                            console.log("1.7")
                        }
                    } else if (i === 2) {
                        if ((start.year - 543) % 4 === 0 || ((start.year - 543) % 4 === 0 && (start.year - 543) % 100 === 0 && (start.year - 543) % 400 === 0)) {
                            nF += 29;
                            console.log("1.8")
                        }
                        else {
                            nF += 28;
                            console.log("1.9")
                        }
                    }
                }
                console.log("1=" + nF);
                nF /= f;
            } else if (start.month === end.month && start.year === end.year) {
                nF = end.day - (start.day - 1);
                console.log("2=" + nF);
                nF /= f;
            } else if (start.year !== end.year) {
                for (let j = start.year; j <= end.year; j++) {
                    console.log("j=" + j);
                    if (j !== end.year) {
                        for (let k = start.month; k <= 12; k++) {
                            console.log("k=" + k);
                            if (k === start.month && j === start.year && (k === 1 || k === 3 || k === 5 || k === 7 || k === 8 || k === 10 || k === 12)) {
                                nF = 31 - (start.day - 1);
                                console.log("3.1=" + nF);
                            }
                            else if (k === 1 || k === 3 || k === 5 || k === 7 || k === 8 || k === 10 || k === 12) {
                                nF += 31;
                                console.log("3.2=" + nF);
                            }
                            else if (k === start.month && j === start.year && (k === 4 || k === 6 || k === 9 || k === 11)) {
                                nF = 30 - (start.day - 1);
                                console.log("3.3=" + nF);
                            }
                            else if (k === 4 || k === 6 || k === 9 || k === 11) {
                                nF += 30;
                                console.log("3.4=" + nF);
                            }
                            else if (k === start.month && k === 2) {
                                if ((j - 543) % 4 === 0 || ((j - 543) % 4 === 0 && (j - 543) % 100 === 0 && (j - 543) % 400 === 0)) {
                                    nF = 29 - (start.day - 1);
                                    console.log("3.5=" + nF);
                                }
                                else {
                                    nF = 28 - (start.day - 1);
                                    console.log("3.6=" + nF);
                                }
                            } else if (k === 2) {
                                if ((j - 543) % 4 === 0 || ((j - 543) % 4 === 0 && (j - 543) % 100 === 0 && (j - 543) % 400 === 0)) {
                                    nF += 29;
                                    console.log("3.7=" + nF);
                                }
                                else {
                                    nF += 28;
                                    console.log("3.8=" + nF);
                                }
                            }
                        }
                    } else if (j === end.year) {
                        for (let l = 1; l <= end.month; l++) {
                            console.log("l=" + l);
                            if (l === end.month) {
                                nF += end.day;
                                console.log("3.11=" + nF);
                            } else if (l === 1 || l === 3 || l === 5 || l === 7 || l === 8 || l === 10 || l === 12) {
                                nF += 31;
                                console.log("3.12=" + nF);
                            } else if (l === 4 || l === 6 || l === 9 || l === 11) {
                                nF += 30;
                                console.log("3.13=" + nF);
                            } else if (l === 2) {
                                if ((j - 543) % 4 === 0 || ((j - 543) % 4 === 0 && (j - 543) % 100 === 0 && (j - 543) % 400 === 0)) {
                                    nF += 29;
                                    console.log("3.14=" + nF);
                                }
                                else {
                                    nF += 28;
                                    console.log("3.15=" + nF);
                                }
                            }
                        }
                    }
                }
                console.log("3=" + nF);
                nF /= f;
            }
            nF++;
            console.log("nF/f=" + nF);

            let nDay = start.day;
            let nMonth = start.month;
            let nYear = start.year;
            let m = 2;
            let numF = 0;
            const date = {
                day: nDay,
                month: nMonth,
                year: nYear
            }
            var dateToDo = [];
            dateToDo = dateToDo.concat(date);
            while (m <= nF) {
                if (nDay <= 31) {
                    nDay++;
                    numF++;

                    if (nDay > 31 && (nMonth === 1 || nMonth === 3 || nMonth === 5 || nMonth === 7 || nMonth === 8 || nMonth === 10 || nMonth === 12)) {
                        nDay -= 31;
                        if (nMonth === 12) {
                            nYear++;
                            nMonth = 1;
                        } else nMonth++;
                    } else if (nDay > 30 && (nMonth === 4 || nMonth === 6 || nMonth === 9 || nMonth === 11)) {
                        nDay -= 30;
                        nMonth++;
                    } else if (nDay > 28 && (nMonth === 2 && ((nYear - 543) % 4 !== 0 || ((nYear - 543) % 4 !== 0 || (nYear - 543) % 100 === 0)))) {
                        nDay -= 28;
                        nMonth++;
                    } else if (nDay > 29 && (nMonth === 2 && ((nYear - 543) % 4 === 0 || ((nYear - 543) % 4 === 0 && (nYear - 543) % 100 === 0 && (nYear - 543) % 400 === 0)))) {
                        nDay -= 29;
                        nMonth++;
                    }
                    if (numF == f) {
                        const date = {
                            day: nDay,
                            month: nMonth,
                            year: nYear
                        }
                        dateToDo = dateToDo.concat(date);
                        console.log(date);
                        console.log(dateToDo);
                        numF = 0;
                        m++;
                    }
                }
                this.setState({
                    dateToDo: dateToDo
                })
                console.log("m=" + m);
                console.log("numF=" + numF);
                console.log("day=" + nDay);
            }
        } else {
            const openAndCloseTimes = {
                start,
                end
            }

            let builtIns = [];
            var data = {};

            if (this.state.builtInWidgetGender) {
                builtIns = builtIns.concat({ builtInWidget: "gender" })
            }
            if (this.state.builtInWidgetAges) {
                builtIns = builtIns.concat({ builtInWidget: "ages" })
            }
            if (this.state.builtInWidgetStatus) {
                builtIns = builtIns.concat({ builtInWidget: "status" })
            }
            if (this.state.builtInWidgetEducation) {
                builtIns = builtIns.concat({ builtInWidget: "education" })
            }
            if (this.state.builtInWidgetJob) {
                builtIns = builtIns.concat({ builtInWidget: "job" })
            }
            if (this.state.builtInWidgetIncome) {
                builtIns = builtIns.concat({ builtInWidget: "income" })
            }
            console.log(builtIns)

            if (builtIns[0] !== undefined) {
                data = {
                    nameSurvey: this.state.nameSurvey,
                    description: this.state.description,
                    shareTo: this.state.shareTo,
                    wantName: this.state.wantName,
                    haveGroup: this.state.haveGroup,
                    data: JSON.parse(JSON.stringify(this.surveyCreator.text)),
                    builtIns: builtIns,
                    frequency: this.state.frequency,
                    doOnce: this.state.doOnce,
                    openAndCloseTimes: openAndCloseTimes,
                    status: this.props.survey.status
                }
            } else {
                data = {
                    nameSurvey: this.state.nameSurvey,
                    description: this.state.description,
                    shareTo: this.state.shareTo,
                    wantName: this.state.wantName,
                    haveGroup: this.state.haveGroup,
                    data: JSON.parse(JSON.stringify(this.surveyCreator.text)),
                    frequency: this.state.frequency,
                    doOnce: this.state.doOnce,
                    openAndCloseTimes: openAndCloseTimes,
                    status: this.props.survey.status

                }
            }
            this.props.editStep1(data);
            console.log(data);
        }
    }

    sendData() {
        console.log(this.state.dateToDo);

        const start = {
            day: Number(this.state.startDate),
            month: Number(this.state.startMonth),
            year: Number(this.state.startYear)
        }
        const end = {
            day: Number(this.state.endDate),
            month: Number(this.state.endMonth),
            year: Number(this.state.endYear)
        }
        console.log(start);
        console.log(end);
        const openAndCloseTimes = {
            start,
            end
        }
        let builtIns = [];
        var data = {};

        if (this.state.builtInWidgetGender) {
            builtIns = builtIns.concat({ builtInWidget: "gender" })
        }
        if (this.state.builtInWidgetAges) {
            builtIns = builtIns.concat({ builtInWidget: "ages" })
        }
        if (this.state.builtInWidgetStatus) {
            builtIns = builtIns.concat({ builtInWidget: "status" })
        }
        if (this.state.builtInWidgetEducation) {
            builtIns = builtIns.concat({ builtInWidget: "education" })
        }
        if (this.state.builtInWidgetJob) {
            builtIns = builtIns.concat({ builtInWidget: "job" })
        }
        if (this.state.builtInWidgetIncome) {
            builtIns = builtIns.concat({ builtInWidget: "income" })
        }
        console.log(builtIns)

        if (builtIns[0] !== undefined) {
            data = {
                nameSurvey: this.state.nameSurvey,
                description: this.state.description,
                shareTo: this.state.shareTo,
                wantName: this.state.wantName,
                haveGroup: this.state.haveGroup,
                data: JSON.parse(JSON.stringify(this.surveyCreator.text)),
                builtIns: builtIns,
                frequency: this.state.frequency,
                doOnce: this.state.doOnce,
                openAndCloseTimes: openAndCloseTimes,
                status: this.props.survey.status,
                dateToDo: this.state.dateToDo
            }
        } else {
            data = {
                nameSurvey: this.state.nameSurvey,
                description: this.state.description,
                shareTo: this.state.shareTo,
                wantName: this.state.wantName,
                haveGroup: this.state.haveGroup,
                data: JSON.parse(JSON.stringify(this.surveyCreator.text)),
                frequency: this.state.frequency,
                doOnce: this.state.doOnce,
                openAndCloseTimes: openAndCloseTimes,
                status: this.props.survey.status,
                dateToDo: this.state.dateToDo

            }
        }
        this.props.editStep1(data);
        console.log(data);
    }

    render() {
        return (
            <div>
                <section className="content-header">

                </section>

                <section className="content">
                    <h1>{this.props.survey.status === "template" ? "แม่แบบแบบสอบถาม" : "แก้ไขแบบสอบถาม"}</h1>
                    <br></br>
                    <h3>ส่วนที่ 1 : ข้อมูลทั่วไป</h3>
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <h3 className="box-title">สร้างแบบสอบถามใหม่</h3>
                        </div>

                        <div className="box-body">
                            <div className="form-group">
                                <label>ชื่อแบบสอบถาม :</label>
                                <input required
                                    type="text"
                                    id="nameSurvey"
                                    className="form-control"
                                    placeholder="โปรดกรอกชื่อแบบสอบถาม"
                                    value={this.state.nameSurvey}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>คำอธิบาย :</label>
                                <textarea
                                    id="description"
                                    className="form-control"
                                    placeholder="โปรดกรอกคำอธิบายแบบสอบถาม"
                                    value={this.state.description}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>ผู้มีสิทธิทำแบบสอบถาม :</label>
                                <select required
                                    id="shareTo"
                                    className="form-control"
                                    value={this.state.shareTo}
                                    onChange={this.onChangeShareTo}>
                                    <option>ต้องการแสดงผลแบบใด?</option>
                                    <option value="CLOSE">กลุ่มปิด</option>
                                    <option value="OPEN">กลุ่มเปิด</option>
                                    <option value="PUBLIC">กลุ่มสาธารณะ</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        id="wantName"
                                        type="checkbox"
                                        className="flat-green"
                                        checked={this.state.wantName}
                                        onChange={this.onChangeWantName}
                                    /> ต้องการทราบชื่อผู้ทำแบบสอบถาม
                                    </label>
                            </div>
                            {this.state.shareTo !== "PUBLIC" && this.state.shareTo !== "" ?
                                <div className="form-group">
                                    <label>
                                        <input
                                            id="haveGroup"
                                            type="checkbox"
                                            className="flat-green"
                                            checked={this.state.haveGroup}
                                            onChange={this.onChangeHaveGroup}
                                        /> ต้องการให้มีสมาชิกเข้าร่วมกลุ่มทำแบบสอบถาม
                                        </label>
                                </div>
                                : ""}
                        </div>
                    </div>
                    <br></br>
                    <h3>ส่วนที่ 2 : แบบสอบถาม</h3>
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <h3 className="box-title">คำถามพื้นฐานสำเร็จรูป</h3>&nbsp;
                            <small>( โปรดเลือกคำถามเกี่ยวกับข้อมูลส่วนตัวจากที่นี่ )</small>
                        </div>

                        <div className="box-body">
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        className="flat-green"
                                        checked={this.state.builtInWidgetGender}
                                        onChange={this.onChangeBuiltInWidgetGender}
                                    /> คำถามเรื่องเพศ
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        className="flat-green"
                                        checked={this.state.builtInWidgetAges}
                                        onChange={this.onChangeBuiltInWidgetAges}
                                    /> คำถามเรื่องอายุ
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        className="flat-green"
                                        checked={this.state.builtInWidgetStatus}
                                        onChange={this.onChangeBuiltInWidgetStatus}
                                    /> คำถามเรื่องสถานภาพ
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        className="flat-green"
                                        checked={this.state.builtInWidgetEducation}
                                        onChange={this.onChangeBuiltInWidgetEducation}
                                    /> คำถามเรื่องระดับการศึกษา
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        className="flat-green"
                                        checked={this.state.builtInWidgetJob}
                                        onChange={this.onChangeBuiltInWidgetJob}
                                    /> คำถามเรื่องอาชีพ
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        className="flat-green"
                                        checked={this.state.builtInWidgetIncome}
                                        onChange={this.onChangeBuiltInWidgetIncome}
                                    /> คำถามเรื่องรายได้เฉลี่ยต่อเดือน
                                </label>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div id="surveyCreatorContainer" />
                    <br></br>
                    <h3>ส่วนที่ 3 : ความถี่/ระยะเวลา</h3>
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <h3 className="box-title">ความถี่ในการทำแบบสอบถาม</h3>
                        </div>

                        <div className="box-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>
                                            <input type="radio"
                                                name="optionsRadios"
                                                id="optionsRadios1"
                                                checked={this.state.doOnce}
                                                onChange={this.onChangeDoOnce}
                                            /> 1 ครั้ง
                                            </label>
                                    </div>
                                </div>


                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>
                                            <input type="radio"
                                                name="optionsRadios"
                                                id="optionsRadios2"
                                                checked={this.state.doMany}
                                                onChange={this.onChangeDoMany}
                                            /> มากกว่า 1 ครั้ง
                                        </label>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    {this.state.haveGroup ?
                                        <div className="form-group">
                                            <label>
                                                <input type="radio"
                                                    name="optionsRadios"
                                                    id="optionsRadios3"
                                                    checked={this.state.setFreq}
                                                    onChange={this.onChangeSetFreq}
                                                /> กำหนดเอง
                                            </label>
                                        </div>
                                        :
                                        <div className="form-group">
                                            <label>
                                                <input type="radio"
                                                    name="optionsRadios"
                                                    id="optionsRadios3"
                                                    onChange={this.onChangeSetFreq}
                                                    disabled
                                                /> กำหนดเอง
                                            </label>
                                        </div>
                                    }
                                </div>
                            </div>

                            {this.state.setFreq ?
                                <div className="row">
                                    <div className="col-md-3">
                                        <label>ทำแบบสอบถามทุกๆ</label>
                                    </div>

                                    <div className="col-md-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="จำนวนครั้งต่อหน่วยเวลา"
                                            value={this.state.frequency.amount !== 0 ? this.state.frequency.amount : ""}
                                            onChange={this.onChangeAmount}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <select
                                            className="form-control"
                                            value={this.state.frequency.unitsOfTime}
                                            onChange={this.onChangeUnitTime}>
                                            <option >หน่วยเวลา?</option>
                                            <option value="day">วัน</option>
                                            <option value="week">สัปดาห์</option>
                                            <option value="month">เดือน</option>
                                            <option value="year">ปี</option>
                                        </select>
                                    </div>

                                </div>
                                : ""
                            }
                        </div>
                    </div>

                    {this.state.schedule ?
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">กำหนดเวลาเปิด/ปิดอัตโนมัติ</h3>

                                <div className="box-tools pull-right">
                                    <button type="button" className="btn btn-box-tool" data-widget="collapse" onClick={() => this.setState({ schedule: false })}><i className="fa fa-minus" /></button>
                                </div>
                            </div>

                            <div className="box-body">
                                <label><i className="fa fa-calendar" /> วันเริ่มต้น :</label>
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                id="startDate"
                                                className="form-control"
                                                placeholder="วันที่"
                                                value={this.state.startDate}
                                                onChange={this.onChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <select
                                            className="form-control"
                                            value={this.state.startMonth}
                                            onChange={this.onChangeStartMonth}>
                                            <option >เดือน ?</option>
                                            <option value="1">มกราคม</option>
                                            <option value="2">กุมภาพันธ์</option>
                                            <option value="3">มีนาคม</option>
                                            <option value="4">เมษายน</option>
                                            <option value="5">พฤษภาคม</option>
                                            <option value="6">มิถุนายน</option>
                                            <option value="7">กรกฎาคม</option>
                                            <option value="8">สิงหาคม</option>
                                            <option value="9">กันยายน</option>
                                            <option value="10">ตุลาคม</option>
                                            <option value="11">พฤศจิกายน</option>
                                            <option value="12">ธันวาคม</option>
                                        </select>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                id="startYear"
                                                className="form-control"
                                                placeholder="ปี พ.ศ."
                                                value={this.state.startYear}
                                                onChange={this.onChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <label><i className="fa fa-calendar" /> วันสิ้นสุด :</label>
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                id="endDate"
                                                className="form-control"
                                                placeholder="วันที่"
                                                value={this.state.endDate}
                                                onChange={this.onChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <select
                                            className="form-control"
                                            value={this.state.endMonth}
                                            onChange={this.onChangeEndMonth}>
                                            <option >เดือน ?</option>
                                            <option value="1">มกราคม</option>
                                            <option value="2">กุมภาพันธ์</option>
                                            <option value="3">มีนาคม</option>
                                            <option value="4">เมษายน</option>
                                            <option value="5">พฤษภาคม</option>
                                            <option value="6">มิถุนายน</option>
                                            <option value="7">กรกฎาคม</option>
                                            <option value="8">สิงหาคม</option>
                                            <option value="9">กันยายน</option>
                                            <option value="10">ตุลาคม</option>
                                            <option value="11">พฤศจิกายน</option>
                                            <option value="12">ธันวาคม</option>
                                        </select>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                id="endYear"
                                                className="form-control"
                                                placeholder="ปี พ.ศ."
                                                value={this.state.endYear}
                                                onChange={this.onChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="box box-primary collapsed-box">
                            <div className="box-header with-border">
                                <h3 className="box-title">กำหนดเวลาเปิด/ปิดอัตโนมัติ</h3>

                                <div className="box-tools pull-right">
                                    <button type="button" className="btn btn-box-tool" data-widget="collapse" onClick={() => this.setState({ schedule: true })}><i className="fa fa-plus" /></button>
                                </div>
                            </div>

                            <div className="box-body">
                                <label><i className="fa fa-calendar" /> วันเริ่มต้น :</label>
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                id="startDate"
                                                className="form-control"
                                                placeholder="วันที่"
                                                value={this.state.startDate}
                                                onChange={this.onChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <select
                                            className="form-control"
                                            value={this.state.startMonth}
                                            onChange={this.onChangeStartMonth}>
                                            <option >เดือน ?</option>
                                            <option value="1">มกราคม</option>
                                            <option value="2">กุมภาพันธ์</option>
                                            <option value="3">มีนาคม</option>
                                            <option value="4">เมษายน</option>
                                            <option value="5">พฤษภาคม</option>
                                            <option value="6">มิถุนายน</option>
                                            <option value="7">กรกฎาคม</option>
                                            <option value="8">สิงหาคม</option>
                                            <option value="9">กันยายน</option>
                                            <option value="10">ตุลาคม</option>
                                            <option value="11">พฤศจิกายน</option>
                                            <option value="12">ธันวาคม</option>
                                        </select>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                id="startYear"
                                                className="form-control"
                                                placeholder="ปี พ.ศ."
                                                value={this.state.startYear}
                                                onChange={this.onChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <label><i className="fa fa-calendar" /> วันสิ้นสุด :</label>
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                id="endDate"
                                                className="form-control"
                                                placeholder="วันที่"
                                                value={this.state.endDate}
                                                onChange={this.onChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <select
                                            className="form-control"
                                            value={this.state.endMonth}
                                            onChange={this.onChangeEndMonth}>
                                            <option >เดือน ?</option>
                                            <option value="1">มกราคม</option>
                                            <option value="2">กุมภาพันธ์</option>
                                            <option value="3">มีนาคม</option>
                                            <option value="4">เมษายน</option>
                                            <option value="5">พฤษภาคม</option>
                                            <option value="6">มิถุนายน</option>
                                            <option value="7">กรกฎาคม</option>
                                            <option value="8">สิงหาคม</option>
                                            <option value="9">กันยายน</option>
                                            <option value="10">ตุลาคม</option>
                                            <option value="11">พฤศจิกายน</option>
                                            <option value="12">ธันวาคม</option>
                                        </select>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                id="endYear"
                                                className="form-control"
                                                placeholder="ปี พ.ศ."
                                                value={this.state.endYear}
                                                onChange={this.onChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    <button className="btn btn-warning" onClick={this.saveDraft.bind(this)}>บันทึกแบบร่าง</button>&nbsp;
                    <button className="btn btn-info" onClick={this.onSubmit}>ต่อไป</button>

                    {this.state.dateToDo[0] !== undefined ? this.sendData() : ""}
                </section>
                {console.log(this.props.survey)}
            </div>
        )
    }
}

EditSurvey.propTypes = {
    editDraftStep1: PropTypes.func.isRequired,
    editStep1: PropTypes.func.isRequired,
    survey: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    survey: state.survey,
});

export default connect(mapStateToProps, { editDraftStep1, editStep1 })(EditSurvey);
