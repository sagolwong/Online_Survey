import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import axios from 'axios';
import SimpleCrypto from "simple-crypto-js";

import * as Survey from "survey-react";
import "survey-react/survey.css";

import "jquery-ui/themes/base/all.css";
import "nouislider/distribute/nouislider.css";
import "select2/dist/css/select2.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";

import "jquery-bar-rating/dist/themes/css-stars.css";

import $ from "jquery";
import "jquery-ui/ui/widgets/datepicker.js";
import "select2/dist/js/select2.js";
import "jquery-bar-rating";

import * as widgets from "surveyjs-widgets";

import "icheck/skins/square/blue.css";
window["$"] = window["jQuery"] = $;
require("icheck");

Survey.StylesManager.applyTheme("default");

widgets.icheck(Survey, $);
widgets.select2(Survey, $);
widgets.inputmask(Survey);
widgets.jquerybarrating(Survey, $);
widgets.jqueryuidatepicker(Survey, $);
widgets.nouislider(Survey);
widgets.select2tagbox(Survey, $);
widgets.signaturepad(Survey);
widgets.sortablejs(Survey);
widgets.ckeditor(Survey);
widgets.autocomplete(Survey, $);
widgets.bootstrapslider(Survey);

class OnlineSurvey extends Component {
    constructor(props) {
        super(props);

        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear() + 543;

        this.state = {
            profile: {},
            survey: {},
            answer: [],
            listSurvey: [],
            followResult: [],
            frequency: [],
            checkDoNot: true,
            checkHaveGroup: false,
            askEncrypt: false,
            wantEncrypt: false,
            dontWantEncrypt: false,
            resultAsString: {},
            checkEncrypt: false,
            encryptAnswer: false,
            checkSurvey: false,
            secretKey: "",
            title: "",
            pages: [],
            cdate: date,
            cmonth: month,
            cyear: year,
            sdate: 0,
            smonth: 0,
            syear: 0,
            edate: 0,
            emonth: 0,
            eyear: 0,
        };
        this.onComplete = this.onComplete.bind(this);
        this.encryptAnswer = this.encryptAnswer.bind(this);
    }

    async componentDidMount() {
        const surveyId = this.props.surveyId;
        const userId = this.props.auth.user.id;
        const name = this.props.name;
        console.log(name);
        console.log(surveyId);
        console.log("cdate:" + this.state.cdate);
        console.log("cmonth:" + this.state.cmonth);
        console.log("cyear:" + this.state.cyear);

        await axios.get(`/surveys/find/` + surveyId)
            .then(response => {
                this.setState({
                    survey: response.data,
                    title: response.data.data.title,
                    pages: response.data.data.pages,
                    sdate: response.data.openAndCloseTimes.start.day,
                    smonth: response.data.openAndCloseTimes.start.month,
                    syear: response.data.openAndCloseTimes.start.year,
                    edate: response.data.openAndCloseTimes.end.day,
                    emonth: response.data.openAndCloseTimes.end.month,
                    eyear: response.data.openAndCloseTimes.end.year,
                    checkSurvey: true
                })
                console.log(this.state.survey);
                console.log(this.state.title);
                console.log(this.state.pages);
                console.log(this.state.survey.data);
            })
            .catch((error) => {
                console.log(error);
            })

        await axios.get('/users/' + userId)
            .then(response => {
                this.setState({
                    profile: response.data
                })
                console.log(this.state.profile);
                console.log(this.state.profile.recentOtherSurveys.length);
            })
            .catch((error) => {
                console.log(error);
            })

        //ดึงข้อมูลจาก answers
        await axios.get(`/answers/find/` + surveyId)
            .then(response => {
                this.setState({
                    answer: response.data
                })
                console.log(this.state.answer[0]);

            })
            .catch((error) => {
                console.log(error);
            })
        //ดึงข้อมูลจาก listSurvey
        await axios.get(`/listSurvey/find/` + userId)
            .then(response => {
                this.setState({
                    listSurvey: response.data
                })
                console.log(this.state.listSurvey[0]);

            })
            .catch((error) => {
                console.log(error);
            })
        //ดึงข้อมูลจาก followResult
        if (await this.state.survey.shareTo === "OPEN" || this.state.survey.shareTo === "CLOSE") {
            axios.get(`/followResults/find/${surveyId}/${userId}`)
                .then(response => {
                    this.setState({
                        followResult: response.data
                    })
                    console.log(this.state.followResult[0]);

                })
                .catch((error) => {
                    console.log(error);
                })

            axios.get('/frequency/find/' + surveyId)
                .then(response => {
                    this.setState({
                        frequency: response.data
                    })
                    console.log(this.state.frequency);
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        //วน loop หาว่ามีการเพิ่ม surveyId ลง listSurvey ของ userId นี้แล้วหรือไม่
        if (await this.state.listSurvey[0] !== undefined) {
            this.state.listSurvey[0].listSurvey.map(res => {
                if (res === surveyId) {
                    this.setState({
                        checkDoNot: false
                    })
                    console.log(this.state.checkDoOnce);
                }
            })
        }

        if (await this.state.survey.haveGroup) {
            this.state.survey.names.map(user => {
                if (user === userId) {
                    this.setState({
                        checkHaveGroup: true
                    })
                }
            })
            console.log(this.state.checkHaveGroup);
        }
    }

    showSurvey() {
        if (this.state.checkSurvey) {
            if ((this.state.survey.doOnce && this.state.checkDoNot) || (!this.state.survey.doOnce)) {
                var elements = [];
                if (this.state.survey.builtIns[0] !== undefined) {
                    this.state.survey.builtIns.map(q => {
                        if (q.builtInWidget === "gender") {
                            elements = elements.concat({
                                type: "radiogroup",
                                name: "widgetGender",
                                title: "เพศ",
                                choices: [
                                    "ชาย",
                                    "หญิง"
                                ],
                                colCount: 2
                            })
                        } else if (q.builtInWidget === "ages") {
                            elements = elements.concat({
                                type: "radiogroup",
                                name: "widgetAges",
                                title: "อายุ",
                                choices: [
                                    {
                                        value: "low18",
                                        text: "น้อยกว่า 18 ปี"
                                    },
                                    {
                                        value: "18-23",
                                        text: "18 - 23 ปี"
                                    },
                                    {
                                        value: "24-29",
                                        text: "24 - 29 ปี"
                                    },
                                    {
                                        value: "30-35",
                                        text: "30 - 35 ปี"
                                    },
                                    {
                                        value: "36-41",
                                        text: "36 - 41 ปี"
                                    },
                                    {
                                        value: "42-47",
                                        text: "42 - 47 ปี"
                                    },
                                    {
                                        value: "48-53",
                                        text: "48 - 53 ปี"
                                    },
                                    {
                                        value: "54-60",
                                        text: "54 - 60 ปี"
                                    },
                                    {
                                        value: "more60",
                                        text: "มากกว่า 60 ปี"
                                    }
                                ]
                            })
                        } else if (q.builtInWidget === "status") {
                            elements = elements.concat({
                                type: "radiogroup",
                                name: "widgetStatus",
                                title: "สถานภาพ",
                                choices: [
                                    {
                                        value: "single",
                                        text: "โสด"
                                    },
                                    {
                                        value: "marry",
                                        text: "สมรส"
                                    },
                                    {
                                        value: "separated",
                                        text: "หย่าร้าง, หม้าย, แยกกันอยู่"
                                    }
                                ]
                            })
                        } else if (q.builtInWidget === "education") {
                            elements = elements.concat({
                                type: "radiogroup",
                                name: "widgetEducation",
                                title: "ระดับการศึกษาขั้นสูงสุด",
                                choices: [
                                    {
                                        value: "ประถมศึกษา",
                                        text: "ประถมศึกษา"
                                    },
                                    {
                                        value: "มัธยมศึกษา",
                                        text: "มัธยมศึกษา"
                                    },
                                    {
                                        value: "ปวช./ปวส./อนุปริญญา",
                                        text: "ปวช./ปวส./อนุปริญญา"
                                    },
                                    {
                                        value: "ปริญญาตรี",
                                        text: "ปริญญาตรี"
                                    },
                                    {
                                        value: "ปริญญาโทหรือสูงกว่า",
                                        text: "ปริญญาโทหรือสูงกว่า"
                                    }
                                ]
                            })
                        } else if (q.builtInWidget === "job") {
                            elements = elements.concat({
                                type: "radiogroup",
                                name: "widgetJob",
                                title: "อาชีพ",
                                choices: [
                                    {
                                        value: "นักเรียน",
                                        text: "นักเรียน"
                                    },
                                    {
                                        value: "นิสิต/นักศึกษา",
                                        text: "นิสิต/นักศึกษา"
                                    },
                                    {
                                        value: "ข้าราชการ/รัฐวิสาหกิจ",
                                        text: "ข้าราชการ/รัฐวิสาหกิจ"
                                    },
                                    {
                                        value: "พนักงานบริษัทเอกชน",
                                        text: "พนักงานบริษัทเอกชน"
                                    },
                                    {
                                        value: "ธุรกิจส่วนตัว",
                                        text: "ธุรกิจส่วนตัว"
                                    },
                                    {
                                        value: "รับจ้าง",
                                        text: "รับจ้าง"
                                    },
                                    {
                                        value: "แม่บ้าน",
                                        text: "แม่บ้าน"
                                    }
                                ],
                                otherText: "อื่นๆ โปรดระบุ"
                            })
                        } else if (q.builtInWidget === "income") {
                            elements = elements.concat({
                                type: "radiogroup",
                                name: "widgetIncome",
                                title: "รายได้เฉลี่ยต่อเดือน",
                                choices: [
                                    {
                                        value: "low5000",
                                        text: "น้อยกว่า 5,000 บาท"
                                    },
                                    {
                                        value: "5000-10000",
                                        text: "5,000-10,000 บาท"
                                    },
                                    {
                                        value: "10001-20000",
                                        text: "10,001-20,000 บาท"
                                    },
                                    {
                                        value: "20001-30000",
                                        text: "20,001-30,000 บาท"
                                    },
                                    {
                                        value: "more30000",
                                        text: "มากกว่า 30,000 บาท"
                                    }
                                ]
                            })
                        }
                    })
                    var widget = {
                        name: "widget",
                        elements
                    }
                }

                var form = JSON.parse(this.state.survey.data);
                if (this.state.survey.builtIns[0] !== undefined) {
                    /*form.pages[1] = form.pages[0];
                    form.pages[0] = widget;*/
                    //form.pages[0] = widget;
                    form.pages.unshift(widget);
                    console.log(form)
                }
                console.log(form.pages);
                Survey.Survey.cssType = "default";
                var model = new Survey.Model(form);
                console.log(model);
                return (
                    <div className="">
                        {this.state.askEncrypt ?
                            <section className="content">
                                <div className="box box-info">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">ท่านต้องการปกปิดคำตอบของท่านหรือไม่</h3>
                                    </div>

                                    <div className="box-body">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>
                                                        <input type="radio"
                                                            name="optionsRadios"
                                                            id="optionsRadios1"
                                                            onChange={this.onChangeEncrypt.bind(this)}
                                                        /> ปกปิดคำตอบ
                                                    </label>
                                                </div>
                                            </div>


                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>
                                                        <input type="radio"
                                                            name="optionsRadios"
                                                            id="optionsRadios2"
                                                            onChange={this.onChangeDoNotEncrypt.bind(this)}
                                                        /> ไม่ปกปิดคำตอบ
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        {this.state.wantEncrypt ?
                                            <input
                                                type="password"
                                                id="secretKey"
                                                className="form-control"
                                                placeholder="กรุณาใส่รหัสผ่านเพื่อใช้ปกปิดข้อมูลของท่าน"
                                                onChange={this.onChange}
                                            /> : ""
                                        }

                                    </div>
                                    <div className="box-footer text-center">
                                        {(this.state.wantEncrypt && (this.state.secretKey !== "")) || this.state.dontWantEncrypt ?
                                            <button className="btn btn-info" onClick={this.confirm.bind(this)}>ยืนยัน</button>
                                            : <button className="btn btn-info" disabled>ยืนยัน</button>
                                        }
                                    </div>
                                </div>
                            </section>
                            : <div className="surveyjs">
                                <h1 style={{ marginLeft: "1%" }}>แบบสอบถามที่ถูกสร้างจากการสนับสนุนของ SurveyJS :</h1>
                                <Survey.Survey
                                    json={form}
                                    onComplete={this.onComplete}
                                    onValueChanged={this.onValueChanged} />
                            </div>
                        }
                    </div>
                )
            } else {
                return <div>แบบสอบถามสามารถทำได้ครั้งเดียว</div>
            }
        } else {
            return (
                <div style={{ fontSize: "25px" }}>
                    <br /><br /><br /><br /><br /><br />
                    <div className="row text-center">
                        <i className="fa fa-refresh fa-spin" />
                    </div>
                    <div className="row text-center">
                        กำลังโหลดข้อมูล...
                        </div>
                </div>
            )
        }
    }

    onValueChanged(result) {
        console.log("value changed!");
        console.log(result.data);
    }

    async onComplete(result) {
        console.log("Complete! " + JSON.stringify(result.data));
        console.log(result.data);
        const surveyId = this.props.surveyId;
        const userId = this.props.auth.user.id;
        const name = this.props.name;
        var resultAsString = result.data;

        if (await this.state.frequency[0] !== undefined) {
            this.setState({
                askEncrypt: true
            })
            if (this.state.survey.wantName) {
                this.setState({
                    resultAsString: {
                        head: "",
                        userId: userId,
                        decryptKey: "",
                        noFrequency: this.state.cdate + "-" + this.state.cmonth + "-" + this.state.cyear,
                        resultAsString
                    }
                })
            } else {
                this.setState({
                    resultAsString: {
                        head: "",
                        noFrequency: this.state.cdate + "-" + this.state.cmonth + "-" + this.state.cyear,
                        resultAsString
                    }
                })
            }
            console.log(this.state.resultAsString);
        } else if (await this.state.survey.shareTo === "CLOSE" || this.state.survey.shareTo === "OPEN") {
            //var resultAsString = result.data;
            this.setState({
                askEncrypt: true
            })
            if (this.state.survey.wantName) {
                this.setState({
                    resultAsString: {
                        head: "",
                        userId: userId,
                        decryptKey: "",
                        resultAsString
                    }
                })
            } else {
                this.setState({
                    resultAsString: {
                        head: "",
                        resultAsString
                    }
                })
            }
            console.log(this.state.resultAsString);
        } else {
            if (await this.state.survey.wantName) {
                if (name === "") {
                    this.setState({
                        resultAsString: {
                            name: this.state.profile.firstname + " " + this.state.profile.lastname,
                            resultAsString
                        },
                        checkEncrypt: true
                    })
                } else {
                    this.setState({
                        resultAsString: {
                            name: name,
                            resultAsString
                        },
                        checkEncrypt: true
                    })
                }

            } else {
                this.setState({
                    resultAsString: {
                        resultAsString
                    },
                    checkEncrypt: true
                })
            }
        }
    }

    async sendData() {
        const surveyId = this.props.surveyId;
        const userId = this.props.auth.user.id;

        console.log("sendData")

        //เช็กว่าถ้ามีการสร้าง answer ไว้อยู่แล้วให้ update ค่าเข้าไป
        if (await this.state.answer[0] !== undefined) {
            const editAnswer = {
                //amountUser: รอเช็กกับ userId ว่ามีอยู่แล้วไหม?
                amountAnswer: this.state.answer[0].amountAnswer + 1,
                answerUsers: this.state.answer[0].answerUsers.concat(this.state.resultAsString)
            }
            console.log(editAnswer);
            axios.post(`/answers/edit/${this.state.answer[0]._id}`, editAnswer)
                .then(res => console.log(res.data));
            //แต่ถ้าไม่มี ให้สร้าง answer สำหรับ surveyId นี้ขึ้นมาใหม่เลย
        } else {
            const createAnswer = {
                surveyId: surveyId,
                answerUsers: [this.state.resultAsString]
            }
            console.log(createAnswer);
            axios.post('/answers/create', createAnswer)
                .then(res => console.log(res.data));
        }

        if (this.state.survey.shareTo === "OPEN" || this.state.survey.shareTo === "CLOSE") {
            //เช็กว่ามีการสร้าง listSurvey สำหรับ userId แล้วหรือยัง
            if (await this.state.listSurvey[0] !== undefined) {
                var check1 = false;
                //วน loop หาว่ามีการเพิ่ม surveyId ลง listSurvey ของ userId นี้แล้วหรือไม่
                this.state.listSurvey[0].listSurvey.map(res => {
                    if (res !== surveyId) {
                        check1 = true;
                    } else {
                        check1 = false;
                    }
                })
                //ถ้ายังไม่มี (check1=true) ให้เพิ่ม surveyId ลง listSurvey ด้วยการ update ค่า 
                if (check1) {
                    const editListSurvey = {
                        listSurvey: this.state.listSurvey[0].listSurvey.concat(surveyId)
                    }
                    console.log(editListSurvey);
                    axios.post(`/listSurvey/edit/${this.state.listSurvey[0]._id}`, editListSurvey)
                        .then(res => console.log(res.data));
                }
                //ถ้ายังไม่มีก็ให้สร้าง listSurvey สำหรับ userId นั้นๆขึ้นมา
            } else {
                const createListSurvey = {
                    userId: userId,
                    listSurvey: [surveyId]
                }
                console.log(createListSurvey);
                axios.post('/listSurvey/create', createListSurvey)
                    .then(res => console.log(res.data));
            }
            //เช็กว่ามีการเพิ่มค่าเข้าไปใน recentOthersurvey หรือยัง
            if (await this.state.profile.recentOtherSurveys[0] !== undefined) {
                var check2 = false;
                //วน loop เพื่อเช็กว่าเคยเพิ่ม surveyId นี้เข้าไปหรือยัง
                this.state.profile.recentOtherSurveys.map(res => {
                    if (res !== surveyId) check2 = true;
                    else check2 = false;
                })
                //ถ้ายังไม่มี (check2=true) 
                if (check2) {
                    //แก้ไปใช้ spilice(0,0,{surveyId})
                    //ให้เช็กว่า recentOtherSurvey มี array มากกว่า 11 ไหม ถ้าไม่ ให้ update ค่าเพิ่มไปได้เลย
                    if (await this.state.profile.recentOtherSurveys.length < 10) {
                        await this.state.profile.recentOtherSurveys.unshift(surveyId)

                        const editRecentProject = await {
                            recentOtherSurveys: this.state.profile.recentOtherSurveys,
                            recentProjects: this.state.profile.recentProjects
                        }
                        await axios.post(`/users/edit/${userId}`, editRecentProject)
                            .then(res => console.log(res.data));
                        //แก้ไปใช้ pop() เพื่อเอาตัวสุดท้ายออก แล้วใช้ spilice(0,0,surveyId) เพื่อเพิ่มอันใหม่มาที่ตัวแรก 
                        //แต่ถ้ามีเท่ากับ 11 หรือ มากกว่า(เป็นไปไม่ได้นอกจาก bug) ให้นำค่าใหม่มาเพิ่มและให้ค่าเก่าสุดเอาออกไปแล้วค่อย update
                    } else {
                        await this.state.profile.recentOtherSurveys.splice(9, 1);
                        await this.state.profile.recentOtherSurveys.unshift(surveyId)

                        const editRecentProject = await {
                            recentOtherSurveys: this.state.profile.recentOtherSurveys,
                            recentProjects: this.state.profile.recentProjects
                        }
                        await axios.post(`/users/edit/${userId}`, editRecentProject)
                            .then(res => console.log(res.data));
                    }
                }
                //ถ้ายังไม่มีก็ให้ เพิ่มค่าลำดับแรกเข้าไปได้เลยโดยการ update
            } else {
                await this.state.profile.recentOtherSurveys.unshift(surveyId)

                const editRecentProject = await {
                    recentOtherSurveys: this.state.profile.recentOtherSurveys,
                    recentProjects: this.state.profile.recentProjects
                }
                await axios.post(`/users/edit/${userId}`, editRecentProject)
                    .then(res => console.log(res.data));
            }
            if (await this.state.followResult[0] !== undefined) {
                var follow = [];
                var date = this.state.cdate + "/" + this.state.cmonth + "/" + this.state.cyear;
                console.log(date);
                follow = this.state.followResult[0].follow.concat(date);
                const followResult = {
                    follow: follow
                }

                axios.post(`/followResults/edit/${this.state.followResult[0]._id}`, followResult)
                    .then(res => console.log(res.data));
            }
        } else {
            //เช็กว่ามีการสร้าง listSurvey สำหรับ userId แล้วหรือยัง
            if (await this.state.listSurvey[0] !== undefined) {
                var check1 = false;
                //วน loop หาว่ามีการเพิ่ม surveyId ลง listSurvey ของ userId นี้แล้วหรือไม่
                this.state.listSurvey[0].listSurvey.map(res => {
                    if (res !== surveyId) {
                        check1 = true;
                    } else {
                        check1 = false;
                    }
                })
                //ถ้ายังไม่มี (check1=true) ให้เพิ่ม surveyId ลง listSurvey ด้วยการ update ค่า 
                if (check1) {
                    const editListSurvey = {
                        listSurvey: this.state.listSurvey[0].listSurvey.concat(surveyId)
                    }
                    console.log(editListSurvey);
                    axios.post(`/listSurvey/edit/${this.state.listSurvey[0]._id}`, editListSurvey)
                        .then(res => console.log(res.data));
                }
                //ถ้ายังไม่มีก็ให้สร้าง listSurvey สำหรับ userId นั้นๆขึ้นมา
            } else {
                const createListSurvey = {
                    userId: userId,
                    listSurvey: [surveyId]
                }
                console.log(createListSurvey);
                axios.post('/listSurvey/create', createListSurvey)
                    .then(res => console.log(res.data));
            }
            //เช็กว่ามีการเพิ่มค่าเข้าไปใน recentOthersurvey หรือยัง
            if (await this.state.profile.recentOtherSurveys[0] !== undefined) {
                var check2 = false;
                //วน loop เพื่อเช็กว่าเคยเพิ่ม surveyId นี้เข้าไปหรือยัง
                this.state.profile.recentOtherSurveys.map(res => {
                    if (res !== surveyId) check2 = true;
                    else check2 = false;
                })
                //ถ้ายังไม่มี (check2=true) 
                if (check2) {
                    //แก้ไปใช้ spilice(0,0,{surveyId})
                    //ให้เช็กว่า recentOtherSurvey มี array มากกว่า 11 ไหม ถ้าไม่ ให้ update ค่าเพิ่มไปได้เลย
                    if (await this.state.profile.recentOtherSurveys.length < 10) {
                        await this.state.profile.recentOtherSurveys.unshift(surveyId)

                        const editRecentProject = await {
                            recentOtherSurveys: this.state.profile.recentOtherSurveys,
                            recentProjects: this.state.profile.recentProjects
                        }
                        await axios.post(`/users/edit/${userId}`, editRecentProject)
                            .then(res => console.log(res.data));
                        //แก้ไปใช้ pop() เพื่อเอาตัวสุดท้ายออก แล้วใช้ spilice(0,0,surveyId) เพื่อเพิ่มอันใหม่มาที่ตัวแรก 
                        //แต่ถ้ามีเท่ากับ 11 หรือ มากกว่า(เป็นไปไม่ได้นอกจาก bug) ให้นำค่าใหม่มาเพิ่มและให้ค่าเก่าสุดเอาออกไปแล้วค่อย update
                    } else {
                        await this.state.profile.recentOtherSurveys.splice(9, 1);
                        await this.state.profile.recentOtherSurveys.unshift(surveyId)

                        const editRecentProject = await {
                            recentOtherSurveys: this.state.profile.recentOtherSurveys,
                            recentProjects: this.state.profile.recentProjects
                        }
                        await axios.post(`/users/edit/${userId}`, editRecentProject)
                            .then(res => console.log(res.data));
                    }
                }
                //ถ้ายังไม่มีก็ให้ เพิ่มค่าลำดับแรกเข้าไปได้เลยโดยการ update
            } else {
                await this.state.profile.recentOtherSurveys.unshift(surveyId)

                const editRecentProject = await {
                    recentOtherSurveys: this.state.profile.recentOtherSurveys,
                    recentProjects: this.state.profile.recentProjects
                }
                await axios.post(`/users/edit/${userId}`, editRecentProject)
                    .then(res => console.log(res.data));
            }
        }


        await this.props.checked({
            step: 3,
            name: this.props.name
        })
    }

    onChangeEncrypt() {
        this.setState({
            wantEncrypt: !this.state.wantEncrypt,
            dontWantEncrypt: false
        });
    }

    onChangeDoNotEncrypt() {
        this.setState({
            dontWantEncrypt: !this.state.dontWantEncrypt,
            wantEncrypt: false
        });
    }

    onChange = e => this.setState({ [e.target.id]: e.target.value })

    confirm() {
        if (this.state.dontWantEncrypt) {
            this.setState({
                checkEncrypt: true
            })
        } else {
            this.encryptAnswer()
        }
    }

    encryptAnswer() {
        if (this.state.secretKey !== "") {
            var simpleCrypto = new SimpleCrypto(this.state.secretKey);
            const secretKey = "SJyevrus";
            var simpleCryptoSystem = new SimpleCrypto(secretKey);
            var head = "surveyJS";

            if (this.state.frequency[0] !== undefined) {
                if (this.state.survey.wantName) {
                    this.setState({
                        resultAsString: {
                            head: simpleCrypto.encrypt(head),
                            userId: simpleCryptoSystem.encrypt(this.state.resultAsString.userId),
                            noFrequency: simpleCrypto.encrypt(this.state.resultAsString.noFrequency),
                            decryptKey: "",
                            resultAsString: simpleCrypto.encrypt(this.state.resultAsString.resultAsString)
                        }, checkEncrypt: true
                    })
                } else {
                    this.setState({
                        resultAsString: {
                            head: simpleCrypto.encrypt(head),
                            noFrequency: simpleCrypto.encrypt(this.state.resultAsString.noFrequency),
                            resultAsString: simpleCrypto.encrypt(this.state.resultAsString.resultAsString)
                        }, checkEncrypt: true
                    })
                }
                console.log(this.state.resultAsString);
            } else if (this.state.survey.shareTo === "CLOSE" || this.state.survey.shareTo === "OPEN") {
                if (this.state.survey.wantName) {
                    this.setState({
                        resultAsString: {
                            head: simpleCrypto.encrypt(head),
                            userId: simpleCryptoSystem.encrypt(this.state.resultAsString.userId),
                            decryptKey: "",
                            resultAsString: simpleCrypto.encrypt(this.state.resultAsString.resultAsString)
                        }, checkEncrypt: true
                    })
                } else {
                    this.setState({
                        resultAsString: {
                            head: simpleCrypto.encrypt(head),
                            resultAsString: simpleCrypto.encrypt(this.state.resultAsString.resultAsString)
                        }, checkEncrypt: true
                    })
                }
                console.log(this.state.resultAsString);
            }
        }
    }

    render() {
        if (this.state.checkEncrypt) this.sendData()
        return (
            <div>
                {this.showSurvey()}
            </div>
        )
    }
}

OnlineSurvey.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(OnlineSurvey);