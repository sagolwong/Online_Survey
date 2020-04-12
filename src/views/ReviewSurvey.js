import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from "prop-types";

import { addStep4, backToStep3, backToEditStep1, editStep2 } from "../actions/surveyActions";

import * as Survey from "survey-react";
import "survey-react/survey.css";
//import "bootstrap/dist/css/bootstrap.css";

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

class ReviewSurvey extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checkP: false
        };
        this.shareTo = this.shareTo.bind(this);
        this.wantName = this.wantName.bind(this);
        this.haveGroup = this.haveGroup.bind(this);
        this.frequency = this.frequency.bind(this);
        this.showBuiltIn = this.showBuiltIn.bind(this);
        this.showSurvey = this.showSurvey.bind(this);
    }

    componentDidMount() {
        if (this.props.type === "template") {
            axios.get(`/projects/` + this.props.survey.projectId)
                .then(response => {
                    this.setState({
                        project: response.data
                    })
                    console.log(this.state.projects);
                })
                .catch((error) => {
                    console.log(error);
                })
            if (this.props.survey.sampleGroupId !== "") {
                axios.get(`/sampleGroups/find/` + this.props.survey.sampleGroupId)
                    .then(response => {
                        this.setState({
                            sampleGroup: response.data,
                            nameSampleGroup: response.data.nameSampleGroup
                        })
                        console.log(this.state.sampleGroups);
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            } else if (this.props.survey.nameSampleGroup !== "") {
                this.setState({ nameSampleGroup: this.props.survey.nameSampleGroup })
            }
        }
    }

    shareTo() {
        if (this.props.survey.shareTo === "OPEN") return "กลุ่มเปิด";
        else if (this.props.survey.shareTo === "CLOSE") return "กลุ่มปิด";
        else if (this.props.survey.shareTo === "PUBLIC") return "กลุ่มสาธารณะ";
    }

    wantName() {
        if (this.props.survey.wantName) return "ใช่";
        else return "ไม่ใช่";
    }

    haveGroup() {
        if (this.props.survey.haveGroup) return "ใช่";
        else return "ไม่ใช่";
    }

    showBuiltIn() {
        return (
            this.props.survey.builtIns.map((builtIn, index) => {
                var nameQ = "";
                if (builtIn.builtInWidget === "gender") nameQ = "คำถามเรื่องเพศ";
                else if (builtIn.builtInWidget === "ages") nameQ = "คำถามเรื่องอายุ";
                else if (builtIn.builtInWidget === "status") nameQ = "คำถามเรื่องสถานภาพ";
                else if (builtIn.builtInWidget === "education") nameQ = "คำถามเรื่องการศึกษา";
                else if (builtIn.builtInWidget === "job") nameQ = "คำถามเรื่องอาชีพ";
                else if (builtIn.builtInWidget === "income") nameQ = "คำถามเรื่องรายได้เฉลี่ยต่อเดือน";

                return (
                    <div className="row">
                        <div className="col-md-6">
                            <label>ข้อที่  {index + 1} :</label>
                        </div>
                        <div className="col-md-6">
                            <input
                                type="text"
                                value={nameQ}
                                disabled
                            />
                        </div>
                    </div>
                )
            })
        )
    }

    showSurvey() {
        var form = JSON.parse(this.props.survey.data);
        Survey.Survey.cssType = "default";
        var model = new Survey.Model(form);
        return (
            <div className="surveyjs">
                <div>
                    <h4>ชุดคำถามที่สร้างขึ้นเอง :</h4>
                    <Survey.Survey model={model} />
                </div>
            </div>
        )
    }

    frequency() {
        if (this.props.survey.frequency.amount !== 0) {
            var unitsOfTime = ""
            if (this.props.survey.frequency.unitsOfTime === "day") unitsOfTime = "วัน";
            else if (this.props.survey.frequency.unitsOfTime === "week") unitsOfTime = "สัปดาห์";
            else if (this.props.survey.frequency.unitsOfTime === "month") unitsOfTime = "เดือน";
            else if (this.props.survey.frequency.unitsOfTime === "year") unitsOfTime = "ปี";
            return "ทุก ๆ " + this.props.survey.frequency.amount + " " + unitsOfTime;
        }
        if (this.props.survey.doOnce) return "ทำได้ครั้งเดียว";
        else return "ทำได้หลายครั้ง";

    }

    dateToDo() {
        return (
            this.props.survey.dateToDo.map((date, index) => {
                return (
                    <div className="row">
                        <div className="col-md-6">
                            <label>ครั้งที่ {index + 1} :</label>
                        </div>
                        <div className="col-md-6">
                            <input
                                type="text"
                                value={date.day + "/" + date.month + "/" + date.year}
                                disabled
                            />
                        </div>
                    </div>
                )
            })
        )
    }

    publish() {
        var data = {
            status: "ONLINE"
        }

        if (this.props.type !== undefined) {
            this.props.editStep2(data);
        } else {
            this.props.addStep4(data);
        }
    }

    saveDraft() {
        var data = {
            status: "DRAFT"
        }

        if (this.props.type !== undefined) {
            this.props.editStep2(data);
        } else {
            this.props.addStep4(data);
        }
    }

    savePrototype() {
        const userId = this.props.auth.user.id;
        const data = {
            userId: userId,
            nameSurvey: this.props.survey.nameSurvey,
            description: this.props.survey.description,
            shareTo: this.props.survey.shareTo,
            wantName: this.props.survey.wantName,
            haveGroup: this.props.survey.haveGroup,
            frequency: this.props.survey.frequency,
            doOnce: this.props.survey.doOnce,
            openAndCloseTimes: this.props.survey.openAndCloseTimes,
            builtIns: this.props.survey.builtIns,
            data: this.props.survey.data
        }
        console.log(data);
        axios.post(`/templates/create`, data)
            .then(res => {
                console.log(res.data)
                this.setState({ checkP: true })
            })
    }

    render() {
        return (
            <div>
                <section className="content-header">
                    <div className="progress active">
                        <div className="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100} style={{ width: '100%' }}>
                            <span className="sr-only">REVIEW SURVEY</span>
                        </div>
                    </div>
                    <h3>ยืนยันรายละเอียดแบบสอบถาม</h3>
                </section>

                <section className="content">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <h3 className="box-title">ส่วนที่ 1 : ข้อมูลทั่วไป</h3>
                        </div>

                        <div className="box-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <label>ชื่อแบบสอบถาม :</label>
                                </div>

                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        value={this.props.survey.nameSurvey}
                                        disabled
                                    />
                                </div>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-md-6">
                                    <label>คำอธิบาย :</label>
                                </div>

                                <div className="col-md-6">
                                    <textarea
                                        value={this.props.survey.description}
                                        disabled
                                    />
                                </div>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-md-6">
                                    <label>ผู้มีสิทธิทำแบบสอบถาม :</label>
                                </div>

                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        value={this.shareTo()}
                                        disabled
                                    />
                                </div>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-md-6">
                                    <label>ต้องการทราบชื่อผู้ทำแบบสอบถาม :</label>
                                </div>

                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        value={this.wantName()}
                                        disabled
                                    />
                                </div>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-md-6">
                                    <label>ต้องการให้มีสมาชิกสำหรับทำแบบสอบถาม :</label>
                                </div>

                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        value={this.haveGroup()}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <h3 className="box-title">ส่วนที่ 2 : แบบสอบถาม</h3>
                        </div>

                        <div className="box-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <label>ชุดคำถามพื้นฐานสำเร็จรูป </label>
                                </div>
                                {this.props.survey.builtIns !== undefined ? ""
                                    : <div className="col-md-6">
                                        ไม่มีการใช้งานชุดคำถามพื้นฐานสำเร็จรูป
                                </div>
                                }
                            </div>
                            {this.props.survey.builtIns !== undefined ? this.showBuiltIn() : ""}
                        </div>
                    </div>

                    {this.showSurvey()}

                    <br />
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <h3 className="box-title">ส่วนที่ 3 : ความถี่/ระยะเวลา</h3>
                        </div>

                        <div className="box-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <label>ความถี่ในการทำแบบสอบถาม :</label>
                                </div>

                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        value={this.frequency()}
                                        disabled
                                    />
                                </div>
                            </div>


                            {this.props.survey.frequency.amount !== 0 ?
                                <div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>ความถี่ในการทำแบบสอบถาม </label>
                                        </div>
                                    </div>
                                    {this.dateToDo()}
                                </div>
                                : ""
                            }
                            <div className="row">
                                <div className="col-md-6">
                                    <label>ระยะเวลาเปิด/ปิดอัตโนมัติ </label>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <label>วันที่เริ่มต้น :</label>
                                </div>

                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        value={this.props.survey.openAndCloseTimes.start.day + "/" + this.props.survey.openAndCloseTimes.start.month + "/" + this.props.survey.openAndCloseTimes.start.year}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <label>วันที่สิ้นสุด :</label>
                                </div>

                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        value={this.props.survey.openAndCloseTimes.end.day + "/" + this.props.survey.openAndCloseTimes.end.month + "/" + this.props.survey.openAndCloseTimes.end.year}
                                        disabled
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                    <button className="btn btn-danger" onClick={this.props.type !== undefined ? () => this.props.backToEditStep1() : () => this.props.backToStep3()}>ย้อนกลับ</button>&nbsp;
                    <button className="btn btn-warning" onClick={this.saveDraft.bind(this)}>บันทึกแบบร่าง</button>&nbsp;
                    {this.state.checkP ?
                        <button className="btn btn-success" onClick={this.savePrototype.bind(this)} disabled>บันทึกต้นแบบ</button>
                        :
                        <button className="btn btn-success" onClick={this.savePrototype.bind(this)}>บันทึกต้นแบบ</button>
                    }&nbsp;
                    <button className="btn btn-info" onClick={this.publish.bind(this)}>เผยแพร่</button>
                </section>
            </div >
        )
    }
}

ReviewSurvey.propTypes = {
    addStep4: PropTypes.func.isRequired,
    backToStep3: PropTypes.func.isRequired,
    backToEditStep1: PropTypes.func.isRequired,
    editStep2: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    survey: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    survey: state.survey
});

export default connect(mapStateToProps, { addStep4, backToStep3, backToEditStep1, editStep2 })(ReviewSurvey);