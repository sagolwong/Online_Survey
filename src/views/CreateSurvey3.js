import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from "prop-types";

import { addStep3, backToStep2 } from "../actions/surveyActions";

class CreateSurvey3 extends Component {
    constructor(props) {
        super(props);

        this.onChangeAmount = this.onChangeAmount.bind(this);
        this.onChangeUnitTime = this.onChangeUnitTime.bind(this);
        this.onChangeSetFreq = this.onChangeSetFreq.bind(this);
        this.onChangeDoOnce = this.onChangeDoOnce.bind(this);
        this.onChangeDoMany = this.onChangeDoMany.bind(this);
        //this.onChangeSchedule = this.onChangeSchedule.bind(this);
        //this.onChangeStartDate = this.onChangeStartDate.bind(this);
        this.onChangeStartMonth = this.onChangeStartMonth.bind(this);
        // this.onChangeStartYear = this.onChangeStartYear.bind(this);
        // this.onChangeEndDate = this.onChangeEndDate.bind(this);
        this.onChangeEndMonth = this.onChangeEndMonth.bind(this);
        // this.onChangeEndYear = this.onChangeEndYear.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        //this.sendData = this.sendData.bind(this);

        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear() + 543;


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

    componentDidMount() {
        if (this.props.survey.comeFrom === "4-3") {
            this.setState({
                schedule: true,
                startDate: this.props.survey.openAndCloseTimes.start.day,
                startMonth: this.props.survey.openAndCloseTimes.start.month,
                startYear: this.props.survey.openAndCloseTimes.start.year,
                endDate: this.props.survey.openAndCloseTimes.end.day,
                endMonth: this.props.survey.openAndCloseTimes.end.month,
                endYear: this.props.survey.openAndCloseTimes.end.year,
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

    onSubmit(e) {
        e.preventDefault();
        console.log(this.state)

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

        const data = {
            frequency: this.state.frequency,
            doOnce: this.state.doOnce,
            openAndCloseTimes: openAndCloseTimes,
            dateToDo: this.state.dateToDo
        }

        this.props.addStep3(data);
        console.log(data);
    }

    render() {
        return (
            <div>
                <section className="content-header">

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
                                    <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus" /></button>
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
                                    <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-plus" /></button>
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

                    <button className="btn btn-link" onClick={() => this.props.backToStep2()}>ย้อนกลับ</button>&nbsp;
                    <button className="btn btn-info" onClick={this.onSubmit}>ต่อไป</button>

                    {this.state.dateToDo[0] !== undefined ? this.sendData() : ""}
                </section>

            </div >
        )
    }
}

CreateSurvey3.propTypes = {
    addStep3: PropTypes.func.isRequired,
    backToStep2: PropTypes.func.isRequired,
    survey: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    survey: state.survey
});
export default connect(mapStateToProps, { addStep3, backToStep2 })(CreateSurvey3);