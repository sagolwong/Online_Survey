import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';
import SimpleCrypto from "simple-crypto-js";

class DecryptionRequest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            survey: {},
            user: {},
            check: "",
            modal: false,
            secretKey: "",
            answer: [],
            listAnswer: [],
            mistake: false
        };
        this.agree = this.agree.bind(this);
        this.disagree = this.disagree.bind(this);
    }

    componentDidMount() {
        const surveyId = this.props.decryptionRequest.data[0];
        const userId = this.props.decryptionRequest.data[1];

        axios.get('/surveys/find/' + surveyId)
            .then(response => {
                this.setState({
                    survey: response.data
                })
                console.log(this.state.survey);
            })
            .catch((error) => {
                console.log(error);
            })

        axios.get('/users/' + userId)
            .then(response => {
                this.setState({
                    user: response.data
                })
                console.log(this.state.user);
            })
            .catch((error) => {
                console.log(error);
            })

        axios.get(`/answers/find/` + surveyId)
            .then(response => {
                this.setState({
                    answer: response.data,
                    listAnswer: response.data[0].answerUsers,
                })
                console.log(this.state.answer);
                console.log(this.state.listAnswer);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    async agree() {
        const userId = this.props.auth.user.id;
        var secretKey = "SJyevrus"
        var simpleCryptoSystem = new SimpleCrypto(secretKey);
        var simpleCrypto = new SimpleCrypto(this.state.secretKey);

        await this.state.listAnswer.map(answer => {
            var userIdA = simpleCryptoSystem.decrypt(answer.userId);
            if (userId === userIdA) {
                var head = simpleCrypto.decrypt(answer.head);
                if (head === "surveyJS") {
                    var key = simpleCryptoSystem.encrypt(this.state.secretKey);
                    answer.decryptKey = key
                    console.log(answer);
                } else {
                    this.setState({
                        mistake: true
                    })
                }
            }
        })
        if (await !this.state.mistake) {
            const editAnswer = {
                answerUsers: this.state.listAnswer
            }
            console.log(editAnswer);
            await axios.post(`/answers/decryption/${this.state.answer[0]._id}`, editAnswer)
                .then(res => console.log(res.data));

            await axios.delete('/requests/' + this.props.decryptionRequest._id)
                .then(res => console.log(res.data));

            window.location = await '/requests';
        }
    }

    disagree() {
        axios.delete('/requests/' + this.props.decryptionRequest._id)
            .then(res => console.log(res.data));

        window.location = '/requests';
    }

    onChange = e => this.setState({ [e.target.id]: e.target.value, mistake: false })

    goToSurveyManagement() {
        window.location = "/survey-management/" + this.props.doOnlyRequest.data[0];
    }

    render() {
        return (
            <div className="box box-info collapsed-box">
                <div className="box-header with-border">
                    <div className="user-block">
                        <img className="img-circle" src="/../dist/img/user1-128x128.jpg" alt="User" />
                        <span className="username"><a onClick={() => window.location = "/user-profile/" + this.state.user._id}> {this.state.user.firstname + " " + this.state.user.lastname} </a></span>
                        <span className="description">ต้องการให้คุณเปิดเผยคำตอบที่ได้ทำไปในแบบสอบถาม : {this.state.survey.nameSurvey}</span>
                    </div>
                    <div className="box-tools">
                        <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-plus" />
                        </button>
                    </div>
                </div>

                <div className="box-body">
                    <div className="row">
                        <div className="col-md-6">
                            <p>แบบสอบถาม : </p>
                        </div>
                        <div className="col-md-6">
                            <a onClick={this.goToSurveyManagement.bind(this)}>{this.state.survey.nameSurvey}</a>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <p>คำอธิบาย : </p>
                        </div>
                        <div className="col-md-6">
                            {this.state.survey.description}
                        </div>
                    </div>
                </div>

                <div className="box-footer">
                    <div className="row-md-6">
                        <div className="col-md-6">
                            <button style={{ width: "200px" }} className="btn btn-primary" data-toggle="modal" data-target="#modalD">ตกลง</button>
                        </div>
                        <div className="col-md-6">
                            <button style={{ width: "200px" }} className="btn btn-danger" onClick={this.disagree}>ไม่ตกลง</button>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="modalD">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">กรุณากรอกรหัสที่คุณใช้เพื่อปกปิดคำตอบของคุณ</h4>
                            </div>
                            <div className="modal-body">
                                <input required
                                    type="password"
                                    id="secretKey"
                                    className="form-control"
                                    value={this.state.secretKey}
                                    onChange={this.onChange}
                                />
                                {this.state.mistake ? <p color="red">รหัสผ่านผิด</p> : ""}
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-default pull-left" data-dismiss="modal">ยกเลิก</button>
                                <button type="submit" className="btn btn-primary" onClick={this.agree}>ยืนยัน</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

DecryptionRequest.propTypes = {
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps)(DecryptionRequest);