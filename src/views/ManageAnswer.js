import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';
import SimpleCrypto from "simple-crypto-js";

import ListAnswer from '../components/list/ListAnswer';

class ManageAnswer extends Component {
    constructor(props) {
        super(props);

        this.sendRequestDecrypt = this.sendRequestDecrypt.bind(this);
        this.deleteAnswer = this.deleteAnswer.bind(this);

        this.state = {
            survey: {},
            project: [],
            already: false,
            amountAnswer: 0,
            amountUser: 0,
            answer: {},
            listAnswer: [],
            deleteAnswer: false,
            checkType: false,
            checkEncrypt: false,
            ownSurvey: true
        };
    }

    async componentDidMount() {
        const surveyId = this.props.surveyId;

        await axios.get(`/surveys/find/` + surveyId)
            .then(response => {
                this.setState({
                    survey: response.data
                })
                console.log(this.state.survey);
            })
            .catch((error) => {
                console.log(error);
            })

        if (await this.state.survey.userId !== this.props.auth.user.id) {
            this.setState({
                ownSurvey: false
            })
        }

        await axios.get(`/answers/find/` + surveyId)
            .then(response => {
                this.setState({
                    answer: response.data,
                    listAnswer: response.data[0].answerUsers,
                    amountAnswer: response.data[0].amountAnswer,
                    amountUser: response.data[0].amountUser
                })
                console.log(this.state.answer);
                console.log(this.state.answer[0].answerUsers);
                console.log(this.state.listAnswer);
            })
            .catch((error) => {
                console.log(error);
            })

        if (await this.state.survey.shareTo === "OPEN" || this.state.survey.shareTo === "CLOSE") {
            this.state.listAnswer.map(answer => {
                if (answer.head !== "" && answer.decryptKey === "") {
                    this.setState({ checkEncrypt: true })
                }
            })
            this.setState({ checkType: true })
        }

        await axios.get(`/projects/` + this.state.survey.projectId)
            .then(response => {
                this.setState({
                    project: response.data,
                    already: true
                })
                console.log(this.state.project);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.deleteAnswer !== this.state.deleteAnswer) {
            axios.get(`/answers/find/` + this.props.surveyId)
                .then(response => {
                    this.setState({
                        answer: response.data,
                        listAnswer: response.data[0].answerUsers,
                        amountAnswer: response.data[0].amountAnswer,
                        amountUser: response.data[0].amountUser
                    })
                    console.log(this.state.answer);
                    console.log(this.state.answer[0].answerUsers);
                    console.log(this.state.listAnswer);
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    sendRequestDecrypt() {
        var userIds = [];
        var check = true;
        var secretKey = "SJyevrus"
        var simpleCryptoSystem = new SimpleCrypto(secretKey);

        this.state.listAnswer.map(answer => {
            var userId = simpleCryptoSystem.decrypt(answer.userId);
            var data = [];
            data = data.concat(this.props.surveyId);
            data = data.concat(this.props.auth.user.id);

            userIds.map(sameUserId => {
                if (userId === sameUserId) check = false;
            })
            if (check) {
                var request = {
                    userId: userId,
                    typeRequest: "decryption",
                    data: data
                }
                console.log(request);
                axios.post('/requests/create', request)
                    .then(res => console.log(res.data));

                userIds = userIds.concat(userId);
                console.log(userIds);
            }
        })
    }

    showAnswers() {
        console.log(this.state.listAnswer);
        return (
            this.state.listAnswer.map((res, index) => {
                console.log(res)
                console.log("index=" + index)
                return <ListAnswer answer={res} surveyType={this.state.survey.shareTo} surveyWantName={this.state.survey.wantName} index={index} delete={this.deleteAnswer} user={res.userId} />
            })
        )
    }

    async deleteAnswer(index1) {
        console.log(this.state.listAnswer)
        await this.state.listAnswer.map((answer, index2) => {
            if (index1 === index2) {
                this.setState(({ listAnswer }) => {
                    const mlistAnswers = [...listAnswer]
                    mlistAnswers.splice(index1, 1)
                    return { listAnswer: mlistAnswers }
                })
            }
        })
        if (await this.state.amountAnswer === this.state.amountUser) {
            this.setState({
                amountAnswer: this.state.amountAnswer - 1,
                amountUser: this.state.amountUser - 1
            })
        } else {
            this.setState({ amountAnswer: this.state.amountAnswer - 1 })
        }
        var answers = {
            amountUser: this.state.amountUser,
            amountAnswer: this.state.amountAnswer,
            answerUsers: this.state.listAnswer
        }
        console.log(answers);
        await axios.post(`/answers/deleteAnswer/${this.state.answer[0]._id}`, answers)
            .then(res => console.log(res.data));

        this.setState({
            deleteAnswer: !this.state.deleteAnswer
        })
    }

    showStatus() {
        if (this.state.survey.status === "ONLINE") return <small><i className="fa fa-circle text-success" /> ออนไลน์</small>
        else if (this.state.survey.status === "PAUSE") return <small><i className="fa fa-circle text-warning" /> หยุดรับข้อมูลชั่วคราว</small>
        else if (this.state.survey.status === "FINISH") return <small><i className="fa fa-circle text-danger" /> ปิดรับข้อมูล</small>
    }

    goToProject() {
        window.location = "/project-management/" + this.state.survey.projectId
    }

    showComponent() {
        return (
            <div>
                <section className="content-header">
                    <h1>
                        <i className="fa fa-file-text-o" /> {this.state.survey.nameSurvey} {this.showStatus()}
                    </h1>
                    {this.state.ownSurvey ?
                        <ol className="breadcrumb">
                            <li ><a href="/requests"><i className="fa fa-envelope-o" /> คำร้องขอ</a></li>
                            <li ><a onClick={this.goToProject.bind(this)}><i className="fa fa-folder-o" /> {this.state.project.nameProject}</a></li>
                            <li className="active"><i className="fa fa-file-text-o" /> {this.state.survey.nameSurvey}</li>
                        </ol>
                        : ""
                    }
                </section>
                <br />
                <section className="content">
                    <div className="row">
                        <div className="col-md-3">
                            <p>มีจำนวนคำตอบ {this.state.amountAnswer} คำตอบ</p>
                        </div>
                        <div className="col-md-3">
                            <p>มีจำนวนผู้ตอบ {this.state.amountUser} คน</p>
                        </div>
                        <div className="col-md-3">
                            {this.state.checkType ? this.state.checkEncrypt ?
                                <button className="btn btn-primary" onClick={this.sendRequestDecrypt}>ส่งคำขอดูคำตอบ</button> :
                                <button className="btn btn-primary" disabled>ส่งคำขอดูคำตอบ</button>
                                : ""}
                        </div>
                    </div>
                    <br /><br />
                    <div className="row">
                        {this.showAnswers()}
                        {/*this.state.listAnswer[0] !== undefined ? this.showAnswers():  <div align="center">ยังไม่มีคำตอบ</div>*/}
                    </div>
                </section>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.state.already ?
                    this.showComponent()
                    : <div style={{ fontSize: "25px" }}>
                        <br /><br /><br /><br /><br /><br />
                        <div className="row text-center">
                            <i className="fa fa-refresh fa-spin" />
                        </div>
                        <div className="row text-center">
                            กำลังโหลดข้อมูล...
                        </div>
                    </div>
                }
            </div>
        )
    }
}

ManageAnswer.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(ManageAnswer);