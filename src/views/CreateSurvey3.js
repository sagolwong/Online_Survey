import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { addStep3, backToStep2, addDraftStep3 } from "../actions/surveyActions";

class CreateSurvey3 extends Component {
    constructor(props) {
        super(props);

        this.onChangeAmount = this.onChangeAmount.bind(this);
        this.onChangeUnitTime = this.onChangeUnitTime.bind(this);
        this.onChangeSetFreq = this.onChangeSetFreq.bind(this);
        this.onChangeDoOnce = this.onChangeDoOnce.bind(this);
        this.onChangeDoMany = this.onChangeDoMany.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.sendData = this.sendData.bind(this);

        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear() + 543;
        let endDate = (year-542)+"/"+month+"/"+date;


        this.state = {
            frequency: {
                amount: 0,
                unitsOfTime: ""
            },
            dateToDo: [],
            setFreq: false,
            doOnce: false,
            doMany: false,
            schedule: false,
            startDate: new Date(),
            endDate: new Date(endDate),
            sDate: date,
            sMonth: month,
            sYear: year,
            eDate: date,
            eMonth: month,
            eYear: year + 1
        };
    }

    componentDidMount() {
        if (this.props.survey.comeFrom === "4-3") {
            const startD = (this.props.survey.openAndCloseTimes.start.year - 543) + "/" + this.props.survey.openAndCloseTimes.start.month + "/" + this.props.survey.openAndCloseTimes.start.day
            const endD = (this.props.survey.openAndCloseTimes.end.year - 543) + "/" + this.props.survey.openAndCloseTimes.end.month + "/" + this.props.survey.openAndCloseTimes.end.day
            this.setState({
                schedule: true,
                startDate: new Date(startD),
                endDate: new Date(endD)
            })
            if (this.props.survey.doOnce) {
                this.setState({
                    doOnce: true,
                    setFreq: false
                })
            } else {
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

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        console.log(this.state)

        const start = {
            day: Number(this.state.startDate.getDate()),
            month: Number(this.state.startDate.getMonth() + 1),
            year: Number(this.state.startDate.getFullYear() + 543)
        }
        const end = {
            day: Number(this.state.endDate.getDate()),
            month: Number(this.state.endDate.getMonth() + 1),
            year: Number(this.state.endDate.getFullYear() + 543)
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

            const data = {
                frequency: this.state.frequency,
                doOnce: this.state.doOnce,
                openAndCloseTimes: openAndCloseTimes
            }

            this.props.addStep3(data);
            console.log(data);
        }
    }

    sendData() {
        console.log(this.state.dateToDo);

        const start = {
            day: Number(this.state.startDate.getDate()),
            month: Number(this.state.startDate.getMonth() + 1),
            year: Number(this.state.startDate.getFullYear() + 543)
        }
        const end = {
            day: Number(this.state.endDate.getDate()),
            month: Number(this.state.endDate.getMonth() + 1),
            year: Number(this.state.endDate.getFullYear() + 543)
        }
        console.log(start);
        console.log(end);
        const openAndCloseTimes = {
            start,
            end
        }

        const data = {
            frequency: this.state.frequency,
            doOnce: this.state.doOnce,
            openAndCloseTimes: openAndCloseTimes,
            dateToDo: this.state.dateToDo
        }

        this.props.addStep3(data);
        console.log(data);
    }

    saveDraft() {
        console.log(this.state.dateToDo);

        const start = {
            day: Number(this.state.startDate.getDate()),
            month: Number(this.state.startDate.getMonth() + 1),
            year: Number(this.state.startDate.getFullYear() + 543)
        }
        const end = {
            day: Number(this.state.endDate.getDate()),
            month: Number(this.state.endDate.getMonth() + 1),
            year: Number(this.state.endDate.getFullYear() + 543)
        }
        console.log(start);
        console.log(end);
        const openAndCloseTimes = {
            start,
            end
        }

        const data = {
            frequency: this.state.frequency,
            doOnce: this.state.doOnce,
            openAndCloseTimes: openAndCloseTimes,
            dateToDo: this.state.dateToDo,
            status: "DRAFT"
        }

        this.props.addDraftStep3(data);
        console.log(data);
    }

    render() {
        return (
            <div>
                {console.log(this.state)}
                <section className="content-header">
                    <div className="progress active">
                        <div className="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100} style={{ width: '75%' }}>
                            <span className="sr-only">STEP 3</span>
                        </div>
                    </div>
                    <h3>ส่วนที่ 3 : ความถี่/ระยะเวลา</h3>
                </section>

                <section className="content">
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
                                    {this.props.survey.haveGroup ?
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
                            {console.log(this.state.setFreq)}
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
                                <div className="row-md-6">
                                    <label>
                                        <i className="fa fa-calendar" /> วันเริ่มต้น :
                                        &nbsp;
                                        <DatePicker
                                            dateFormat="dd/MM/yyyy"
                                            selected={this.state.startDate}
                                            onChange={date => this.setState({ startDate: date })}
                                        />
                                    </label>
                                </div>
                                <div className="row-md-6">
                                    <label>
                                        <i className="fa fa-calendar" /> วันสิ้นสุด :
                                        &nbsp;
                                        <DatePicker
                                            dateFormat="dd/MM/yyyy"
                                            selected={this.state.endDate}
                                            onChange={date => this.setState({ endDate: date })}
                                        />
                                    </label>
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
                                <div className="row-md-6">
                                    <label>
                                        <i className="fa fa-calendar" /> วันเริ่มต้น :
                                        &nbsp;
                                        <DatePicker
                                            dateFormat="dd/MM/yyyy"
                                            selected={this.state.startDate}
                                            onChange={date => this.setState({ startDate: date })}
                                        />
                                    </label>
                                </div>
                                <div className="row-md-6">
                                    <label>
                                        <i className="fa fa-calendar" /> วันสิ้นสุด :
                                        &nbsp;
                                        <DatePicker
                                            dateFormat="dd/MM/yyyy"
                                            selected={this.state.endDate}
                                            onChange={date => this.setState({ endDate: date })}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    }

                    <button className="btn btn-danger" onClick={() => this.props.backToStep2()}>ย้อนกลับ</button>&nbsp;
                    <button className="btn btn-warning" onClick={this.saveDraft.bind(this)}>บันทึกแบบร่าง</button>&nbsp;
                    <button className="btn btn-info" onClick={this.onSubmit}>ต่อไป</button>

                    {this.state.dateToDo[0] !== undefined ? this.sendData() : ""}
                </section>

            </div >
        )
    }
}

CreateSurvey3.propTypes = {
    addStep3: PropTypes.func.isRequired,
    addDraftStep3: PropTypes.func.isRequired,
    backToStep2: PropTypes.func.isRequired,
    survey: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    survey: state.survey
});
export default connect(mapStateToProps, { addStep3, backToStep2, addDraftStep3 })(CreateSurvey3);