import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import axios from 'axios';

class Agreement extends Component {
    constructor(props) {
        super(props);

        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear() + 543;

        this.state = {
            survey: {},
            checkAgree: false,
            name: "",
            checkGroup: true,
            already: false,
            frequency: [],
            listTimeToDo: [],
            nowDate: date,
            nowMonth: month,
            nowYear: year,
            sdate: 0,
            smonth: 0,
            syear: 0,
            edate: 0,
            emonth: 0,
            eyear: 0,
        }
        this.showRequestGroup = this.showRequestGroup.bind(this)
    }

    componentDidMount() {
        const surveyId = this.props.surveyId;
        console.log(surveyId);

        axios.get(`/surveys/find/` + surveyId)
            .then(response => {
                if (response.data.shareTo === "OPEN" || response.data.shareTo === "CLOSE") {
                    if (this.props.auth.isAuthenticated) {
                        this.setState({
                            survey: response.data,
                            already: true,
                            sdate: response.data.openAndCloseTimes.start.day,
                            smonth: response.data.openAndCloseTimes.start.month,
                            syear: response.data.openAndCloseTimes.start.year,
                            edate: response.data.openAndCloseTimes.end.day,
                            emonth: response.data.openAndCloseTimes.end.month,
                            eyear: response.data.openAndCloseTimes.end.year,
                        })
                        localStorage.removeItem("surveyId");
                        console.log(this.state.survey);
                    } else {
                        localStorage.setItem("surveyId", surveyId);
                        console.log(localStorage.surveyId)
                        window.location = '/login';
                    }
                } else {
                    this.setState({
                        survey: response.data,
                        already: true,
                        sdate: response.data.openAndCloseTimes.start.day,
                        smonth: response.data.openAndCloseTimes.start.month,
                        syear: response.data.openAndCloseTimes.start.year,
                        edate: response.data.openAndCloseTimes.end.day,
                        emonth: response.data.openAndCloseTimes.end.month,
                        eyear: response.data.openAndCloseTimes.end.year,
                    })
                    console.log(this.state.survey);
                }

            })
            .catch((error) => {
                console.log(error);
            })

        axios.get('/frequency/find/' + surveyId)
            .then(response => {
                this.setState({
                    frequency: response.data,
                    listTimeToDo: response.data[0].listTimeToDo
                })
                console.log(this.state.frequency);
                console.log(this.state.listTimeToDo);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    onChangeAgree = () => this.setState({ checkAgree: !this.state.checkAgree })

    onChange = e => this.setState({ [e.target.id]: e.target.value });

    checkGroup() {
        if (this.state.already) {
            const userId = this.props.auth.user.id;

            if (this.state.survey.haveGroup) {
                if (this.state.checkGroup) {
                    this.state.survey.names.map(memberId => {
                        if (userId === memberId) {
                            this.setState({
                                checkGroup: false
                            })
                        }
                    })
                }
                if ((this.state.nowYear <= this.state.syear && (this.state.nowMonth < this.state.smonth || (this.state.nowDate < this.state.sdate && this.state.nowDate >= this.state.sdate))) || (this.state.nowMonth === this.state.smonth && this.state.nowDate < this.state.sdate)) {
                    if (this.state.checkGroup) {
                        return this.showRequestGroup()
                    }
                }
            } else {
                this.setState({
                    checkGroup: false
                })
            }
        }
    }

    showRequestGroup() {
        return (
            <div>
                <section className="content">
                    <div className="box box-warning">
                        <div className="box-header with-border text-center">
                            <h3 className="box-title">ท่านยังไม่ได้เข้าร่วมเป็นสมาชิกทำแบบสอบถาม</h3>
                        </div>

                        <div className="box-body text-center">
                            <div className="row">
                                <p>ท่านต้องการเข้าร่วมเป็นสมาชิกเพื่อทำแบบบสอบถามหรือไม่? </p>
                                <div className="col-md-6">
                                    <p>แบบสอบถาม :</p>
                                </div>
                                <div className="col-md-6">
                                    <a href="/"> {this.state.survey.nameSurvey}</a>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <p>คำอธิบายแบบสอบถาม : </p>
                                </div>
                                <div className="col-md-6">
                                    {this.state.survey.description}
                                </div>
                            </div>
                        </div>

                        <div className="box-footer text-center">
                            <button className="btn btn-info" onClick={this.agree.bind(this)}>เข้าร่วมกลุ่ม</button>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    async agree() {
        const userId = this.props.auth.user.id;
        const surveyId = this.props.surveyId;
        var check = false;
        var member = {
            names: this.state.survey.names.concat(userId),
        }

        await axios.post(`/surveys/member/${surveyId}`, member)
            .then(res => console.log(res.data));

        if (await this.state.frequency[0] !== undefined) {
            var data = []
            data = data.concat(surveyId);
            data = data.concat(this.state.frequency[0]._id);
            const request = {
                userId: userId,
                typeRequest: "frequency",
                data: data
            }

            axios.post(`/requests/create`, request)
                .then(res => { console.log(res.data) });


            const followResult = {
                surveyId: surveyId,
                userId: userId,
                frequencyId: this.state.frequency[0]._id
            }
            axios.post(`/followResults/create`, followResult)
                .then(res => { console.log(res.data) });
        }
        if (await this.state.listTimeToDo[0] !== undefined) {
            this.state.listTimeToDo.map(time => {
                if (time.day === this.state.nowDate && time.month === this.state.nowMonth && time.year === this.state.nowYear) {
                    check = true;
                }
            })
        } else {
            const data = {
                step: 1,
                name: ""
            }
            this.props.checked(data);
        }

        if (await check) {
            const data = {
                step: 1,
                name: ""
            }
            this.props.checked(data);
        }
        else window.location = `/requests`;
    }

    showAgreement() {
        if (this.state.survey.status === "DRAFT") {
            return (
                <div>
                    แบบสอบถามยังสร้างไม่เสร็จสิ้น
                </div>
            )
        } else if (this.state.survey.status === "FINISH") {
            return (
                <div>
                    แบบสอบถามหมดอายุแล้ว
                </div>
            )
        } else {
            if ((this.state.nowYear <= this.state.syear && (this.state.nowMonth < this.state.smonth || (this.state.nowDate < this.state.sdate && this.state.nowDate >= this.state.sdate))) || (this.state.nowMonth === this.state.smonth && this.state.nowDate < this.state.sdate)) {
                return (
                    <div>
                        ยังไม่ถึงกำหนดเปิด
                    </div>
                )
            } else if (this.state.nowYear > this.state.eyear || (this.state.nowYear === this.state.eyear && (this.state.nowMonth > this.state.emonth || (this.state.nowMonth === this.state.emonth && this.state.nowDate > this.state.edate)))) {
                const data = {
                    status: "FINISH"
                }

                axios.post(`/surveys/status/${this.props.surveyId}`, data)
                    .then(res => { console.log(res.data) });

                return (
                    <div>
                        แบบสอบถามหมดอายุแล้ว
                    </div>
                )
            } else {
                if (this.state.listTimeToDo[0] !== undefined) {
                    var checkTime = false
                    this.state.listTimeToDo.map(time => {
                        if (time.day === this.state.nowDate && time.month === this.state.nowMonth && time.year === this.state.nowYear) {
                            checkTime = true;
                        }
                    })
                    if (checkTime) {
                        return (
                            <div>
                                <section className="content">
                                    <div className="box box-warning box box-solid">
                                        <div className="box-header with-border text-center">
                                            <h3 className="box-title">ข้อตกลงที่ควรทราบก่อนการทำแบบสอบถาม</h3>
                                        </div>

                                        <div className="box-body">
                                            <ul>
                                                {this.state.survey.shareTo === "CLOSE" ?
                                                    <li>แบบสอบถามนี้เป็นแบบสอบถามประเภทปิด ผู้ที่ไม่ใช่สมาชิกไม่สามารถเข้าทำได้</li> :
                                                    <li>แบบสอบถามนี้เป็นแบบสอบถามประเภทเปิด ผู้ที่ไม่ใช่สมาชิกไม่สามารถเข้าทำได้</li>}
                                                {this.state.survey.wantName ?
                                                    <li>แบบสอบถามนี้ต้องการทราบชื่อผู้ทำแบบสอบถาม</li> :
                                                    <li>แบบสอบถามนี้ไม่ต้องการทราบชื่อผู้ทำแบบสอบถาม</li>}
                                                <li>แบบสอบถามนี้สามารถเลือกปกปิดหรือไม่ปกปิดคำตอบของผู้ทำแบบสอบถามได้หลังจากตอบแบบสอบถามครบทุกข้อ</li>
                                                <br></br>
                                                <div className="form-group">
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            onChange={this.onChangeAgree.bind(this)}
                                                        /> รับทราบและยอมรับการเข้าถึงข้อมูลของแบบสอบถาม
                                                    </label>
                                                </div>
                                            </ul>
                                        </div>

                                        <div className="box-footer text-center">
                                            {this.state.survey.status === "ONLINE" ?
                                                this.state.checkAgree ?
                                                    <button className="btn btn-info" onClick={this.goToOnlineSurvey.bind(this)}>เข้าทำแบบสอบถาม</button>
                                                    : <button className="btn btn-info" disabled>เข้าทำแบบสอบถาม</button>
                                                : <button className="btn btn-info" disabled>เข้าทำแบบสอบถาม</button>
                                            }
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )

                    } else {
                        return (
                            <div>
                                ยังไม่ถึงกำหนดการครั้งต่อไป
                            </div>
                        )
                    }
                } else {
                    if (this.state.survey.shareTo === "CLOSE" || this.state.survey.shareTo === "OPEN") {
                        return (
                            <div>
                                <section className="content">
                                    <div className="box box-warning box box-solid">
                                        <div className="box-header with-border text-center">
                                            <h3 className="box-title">ข้อตกลงที่ควรทราบก่อนการทำแบบสอบถาม</h3>
                                        </div>

                                        <div className="box-body">
                                            <ul>
                                                {this.state.survey.shareTo === "CLOSE" ?
                                                    <li>แบบสอบถามนี้เป็นแบบสอบถามประเภทปิด ผู้ที่ไม่ใช่สมาชิกไม่สามารถเข้าทำได้</li> :
                                                    <li>แบบสอบถามนี้เป็นแบบสอบถามประเภทเปิด ผู้ที่ไม่ใช่สมาชิกไม่สามารถเข้าทำได้</li>}
                                                {this.state.survey.wantName ?
                                                    <li>แบบสอบถามนี้ต้องการทราบชื่อผู้ทำแบบสอบถาม</li> :
                                                    <li>แบบสอบถามนี้ไม่ต้องการทราบชื่อผู้ทำแบบสอบถาม</li>}
                                                <li>แบบสอบถามนี้สามารถเลือกปกปิดหรือไม่ปกปิดคำตอบของผู้ทำแบบสอบถามได้หลังจากตอบแบบสอบถามครบทุกข้อ</li>
                                                <br></br>
                                                <div className="form-group">
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            onChange={this.onChangeAgree.bind(this)}
                                                        /> รับทราบและยอมรับการเข้าถึงข้อมูลของแบบสอบถาม
                                                    </label>
                                                </div>
                                            </ul>
                                        </div>

                                        <div className="box-footer text-center">
                                            {this.state.survey.status === "ONLINE" ?
                                                this.state.checkAgree ?
                                                    <button className="btn btn-info" onClick={this.goToOnlineSurvey.bind(this)}>เข้าทำแบบสอบถาม</button>
                                                    : <button className="btn btn-info" disabled>เข้าทำแบบสอบถาม</button>
                                                : <button className="btn btn-info" disabled>เข้าทำแบบสอบถาม</button>
                                            }
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )
                    } else if (this.state.survey.shareTo === "PUBLIC") {
                        if (this.state.survey.wantName) {
                            return (
                                <div>
                                    <section className="content">
                                        <div className="box box-warning box box-solid">
                                            <div className="box-header with-border text-center">
                                                <h3 className="box-title">ข้อตกลงที่ควรทราบก่อนการทำแบบสอบถาม</h3>
                                            </div>

                                            <div className="box-body">
                                                <ul>
                                                    <li>แบบสอบถามนี้เป็นแบบสอบถามประเภทสาธารณะสามารถเข้าทำได้ทุกคนแม้ไม่ใช่สมาชิก</li>
                                                    <li>แบบสอบถามนี้ต้องการทราบชื่อผู้ทำก่อนเข้าทำแบบสอบถาม</li>
                                                    <li>แบบสอบถามนี้ไม่สามารถปกปิดคำตอบของผู้ทำแบบสอบถามได้</li>
                                                    <br></br>
                                                    <div className="form-group">
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                onChange={this.onChangeAgree.bind(this)}
                                                            /> รับทราบและยอมรับการเข้าถึงข้อมูลของแบบสอบถาม
                                                    </label>
                                                    </div>
                                                    <br></br>
                                                    {this.props.auth.isAuthenticated ?
                                                        <label>{this.props.auth.user.firstname + "" + this.props.auth.user.lastname}</label>
                                                        : <div className="form-group">
                                                            <label>กรุณากรอกชื่อที่ใช้แทนตัวท่าน </label>
                                                            <input required
                                                                type="text"
                                                                id="name"
                                                                className="form-control"
                                                                placeholder="โปรดกรอกชื่อ"
                                                                value={this.state.name}
                                                                onChange={this.onChange}
                                                            />
                                                        </div>
                                                    }

                                                </ul>
                                            </div>

                                            <div className="box-footer text-center">
                                                {this.state.survey.status === "ONLINE" ?
                                                    this.state.checkAgree ?
                                                        <button className="btn btn-info" onClick={this.goToOnlineSurveyPublic.bind(this)}>เข้าทำแบบสอบถาม</button>
                                                        : <button className="btn btn-info" disabled>เข้าทำแบบสอบถาม</button>
                                                    : <button className="btn btn-info" disabled>เข้าทำแบบสอบถาม</button>
                                                }
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            )
                        } else {
                            return (
                                <div>
                                    <section className="content">
                                        <div className="box box-warning box box-solid">
                                            <div className="box-header with-border text-center">
                                                <h3 className="box-title">ข้อตกลงที่ควรทราบก่อนการทำแบบสอบถาม</h3>
                                            </div>

                                            <div className="box-body">
                                                <ul>
                                                    <li>แบบสอบถามนี้เป็นแบบสอบถามประเภทสาธารณะสามารถเข้าทำได้ทุกคนแม้ไม่ใช่สมาชิก</li>
                                                    <li>แบบสอบถามนี้ไม่ต้องการทราบชื่อผู้ทำก่อนเข้าทำแบบสอบถาม</li>
                                                    <li>แบบสอบถามนี้ไม่สามารถปกปิดคำตอบของผู้ทำแบบสอบถามได้</li>
                                                    <br></br>
                                                    <div className="form-group">
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                onChange={this.onChangeAgree.bind(this)}
                                                            /> รับทราบและยอมรับการเข้าถึงข้อมูลของแบบสอบถาม
                                                    </label>
                                                    </div>
                                                </ul>
                                            </div>

                                            <div className="box-footer text-center">
                                                {this.state.survey.status === "ONLINE" ?
                                                    this.state.checkAgree ?
                                                        <button className="btn btn-success" onClick={this.goToOnlineSurveyPublic.bind(this)}>เข้าทำแบบสอบถาม</button>
                                                        : <button className="btn btn-success" disabled>เข้าทำแบบสอบถาม</button>
                                                    : <button className="btn btn-success" disabled>เข้าทำแบบสอบถาม</button>
                                                }
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            )
                        }
                    }
                }
            }
        }
    }

    goToOnlineSurveyPublic() {
        if (this.state.survey.wantName) {
            if ((this.state.name !== "" || this.props.auth.isAuthenticated) && this.state.checkAgree) {
                const data = {
                    step: 2,
                    name: this.state.name
                }
                this.props.checked(data);
            }

        } else {
            if (this.state.checkAgree) {
                const data = {
                    step: 2,
                    name: "NONAME"
                }
                this.props.checked(data);
            }
        }
    }
    goToOnlineSurvey() {
        if (this.state.checkAgree) {
            const data = {
                step: 2,
                name: ""
            }
            this.props.checked(data);
        }
    }

    render() {
        return (
            <div>
                <br/><br/>
                {this.state.checkGroup ? this.checkGroup() : this.showAgreement()}
            </div>
        )
    }
}

Agreement.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Agreement);