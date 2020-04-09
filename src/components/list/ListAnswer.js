import React, { Component } from 'react'
import axios from 'axios';
import SimpleCrypto from "simple-crypto-js";

export default class ListAnswer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checkDecrypt: false,
            checkName: false,
            ready: false,
            keys: [],
            values: [],
            user: {}
        }
        this.showAnswer = this.showAnswer.bind(this);
        this.showName = this.showName.bind(this);
        this.showDetail = this.showDetail.bind(this);
    }

    componentDidMount() {
        const surveyType = this.props.surveyType;
        const surveyWantName = this.props.surveyWantName;
        var secretKey = "SJyevrus";
        var simpleCryptoSystem = new SimpleCrypto(secretKey);
        console.log(surveyType)

        if (surveyType === "OPEN" || surveyType === "CLOSE") {
            if (surveyWantName) {
                if (this.props.answer.head !== "" && this.props.answer.decryptKey !== "") {
                    this.setState({ checkDecrypt: true, checkName: true })
                    var userId = simpleCryptoSystem.decrypt(this.props.answer.userId);
                    axios.get(`/users/` + userId)
                        .then(response => {
                            this.setState({
                                user: response.data
                            })

                            console.log(this.state.user);
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                } else if (this.props.answer.head === "") {
                    this.setState({ checkDecrypt: true, checkName: true })
                    var userId = this.props.answer.userId;
                    axios.get(`/users/` + userId)
                        .then(response => {
                            this.setState({
                                user: response.data
                            })

                            console.log(this.state.user);
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                }
            } else {
                if (this.props.answer.head === "") {
                    this.setState({ checkDecrypt: true })
                }
            }
        } else if (surveyType === "PUBLIC") {
            this.setState({ checkDecrypt: true })
            if (surveyWantName) this.setState({ checkName: true })
        }

    }

    showAnswer() {
        if (this.props.answer.head !== "") {
            var secretKey = "SJyevrus";
            var simpleCryptoSystem = new SimpleCrypto(secretKey);
            var decryptKey = simpleCryptoSystem.decrypt(this.props.answer.decryptKey);
            console.log(decryptKey)
            var simpleCrypto = new SimpleCrypto(decryptKey);
            var answer = JSON.parse(simpleCrypto.decrypt(this.props.answer.resultAsString));
            console.log(Object.keys(answer))
            console.log(Object.values(answer))
            console.log(Object.entries(answer))
            this.setState({
                keys: Object.keys(answer),
                values: Object.values(answer),
                ready: true
            })
        } else {
            this.setState({
                keys: Object.keys(this.props.answer.resultAsString),
                values: Object.values(this.props.answer.resultAsString),
                ready: true
            })
        }

    }

    showDetail() {
        return (
            this.state.keys.map((key, index) => {
                return (
                    <p>{key} : {this.state.values[index].toString()}</p>
                )
            })
        )
    }

    showName() {
        const surveyType = this.props.surveyType;
        if ((surveyType === "OPEN" || surveyType === "CLOSE") && this.state.checkName) {
            return <p>ผู้ตอบแบบสอบถาม : {this.state.user.firstname} {this.state.user.lastname}</p>
        } else if (surveyType === "PUBLIC" && this.state.checkName) {
            return <p>ผู้ตอบแบบสอบถาม : {this.props.answer.name}</p>
        }
    }

    confirm() {
        if (this.props.delete) {
            const index = this.props.index;
            console.log(index)
            console.log(this.state.user.firstname)
            console.log(this.props.user)
            //this.props.delete(index)
        }
    }

    render() {
        return (
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-6">
                        <div className="box box-info">
                            <div className="box-header with-border text-center">
                                <h3 className="box-title">คำตอบจากแบบสอบถาม{this.state.user.firstname}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        {this.state.checkDecrypt ?
                            <button className="btn btn-info" data-toggle="modal" data-target="#modal1" onClick={this.showAnswer}>{this.state.user.firstname}ดูคำตอบ</button>
                            : ""
                        }&nbsp;
                        <button className="btn btn-danger" data-toggle="modal" data-target="#modal2">{this.state.user.firstname}ลบคำตอบ</button>
                    </div>

                    <div className="modal fade" id="modal1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">×</span></button>
                                    <h4 className="modal-title">{this.state.user.firstname}คำตอบของผู้ตอบแบบสอบถาม</h4>
                                </div>
                                <div className="modal-body">
                                    {this.showName()}
                                    {this.state.ready ? this.showDetail() : ""}
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default pull-right" data-dismiss="modal">ปิด</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="modal2">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">×</span></button>
                                    <h4 className="modal-title">คุณต้องการลบคำตอบนี้จริงหรือไม่ ?</h4>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger pull-right" data-dismiss="modal">ไม่ใช่</button>
                                    <button type="button" className="btn btn-primary pull-right" onClick={this.confirm.bind(this)} data-dismiss="modal">ใช่</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
