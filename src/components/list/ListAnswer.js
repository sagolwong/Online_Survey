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
        this.decryptAnswer = this.decryptAnswer.bind(this);
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
        this.decryptAnswer();

    }

    decryptAnswer() {
        if ((this.props.answer.head !== ""&&this.props.answer.head !== undefined) && (this.props.answer.decryptKey !== ""&&this.props.answer.decryptKey !== undefined)) {
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
                values: Object.values(answer)
            })
        } else if (this.props.answer.head === "" || this.props.answer.head === undefined) {
            this.setState({
                keys: Object.keys(this.props.answer.resultAsString),
                values: Object.values(this.props.answer.resultAsString)
            })
            console.log(this.state.user.firstname)
            console.log(this.state.keys)
            console.log(this.state.values)
        }

    }

    showDetail() {
        console.log(this.state.keys)
        return (
            this.state.keys.map((key, index) => {
                console.log(this.state.values[index])
                return (
                    <p>{key} : {this.state.values[index].toString()}</p>
                )
            })
        )
    }

    showName() {
        const surveyType = this.props.surveyType;
        if ((surveyType === "OPEN" || surveyType === "CLOSE") && this.state.checkName) {
            console.log(this.state.user.firstname)
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
            this.props.delete(index)
        }
    }

    showAnswer = () => this.setState({ ready: !this.state.ready })

    render() {
        return (
            <div className="col-md-12">
                {console.log(this.state.ready)}
                <div className="row">
                    <div className="col-md-6">
                        <div className="box box-info">
                            <div className="box-header with-border text-center">
                                <h3 className="box-title">คำตอบจากแบบสอบถาม</h3>
                            </div>

                            {this.state.ready ?
                                <div className="box-body">
                                    {this.showName()}
                                    {this.showDetail()}
                                </div>
                                : ""
                            }
                        </div>
                    </div>

                    <div className="col-md-6">
                        {this.state.checkDecrypt ?
                            <button className="btn btn-info" onClick={this.showAnswer.bind(this)}>ดูคำตอบ</button>
                            : ""
                        }&nbsp;
                        <button className="btn btn-danger" onClick={this.confirm.bind(this)}>ลบคำตอบ</button>
                    </div>
                </div>
            </div>
        )
    }
}
