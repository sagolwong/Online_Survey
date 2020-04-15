import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

class MemberRequest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            survey: {},
            user: {},
            check: "",
            frequency: []
        };
        this.agree = this.agree.bind(this);
        this.disagree = this.disagree.bind(this);
    }

    componentDidMount() {
        const surveyId = this.props.memberRequest.data[0];
        const userId = this.props.memberRequest.data[1];

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
    }

    async agree() {
        const userId = this.props.auth.user.id;
        const surveyId = this.props.memberRequest.data[0];
        var checkRepeat = false;

        this.state.survey.names.map(memberId => {
            if (memberId === userId) checkRepeat = true;
        })
        if (!checkRepeat) {
            var member = await {
                names: this.state.survey.names.concat(userId),
            }

            await axios.post(`/surveys/member/${surveyId}`, member)
                .then(res => {
                    this.setState({
                        check: res.data
                    })
                    console.log(res.data)
                });

            if (await this.state.check === "Survey update!") {
                axios.delete('/requests/' + this.props.memberRequest._id)
                    .then(res => console.log(res.data));
            }

            await axios.get('/frequency/find/' + surveyId)
                .then(response => {
                    this.setState({
                        frequency: response.data
                    })
                    console.log(this.state.frequency);
                })
                .catch((error) => {
                    console.log(error);
                })
            if (await this.state.frequency[0] !== undefined) {
                var data = []
                data = data.concat(surveyId);
                data = data.concat(this.state.frequency[0]._id);
                data = data.concat(this.state.user._id);
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
            window.location = await '/requests';
        }

    }

    disagree() {
        axios.delete('/requests/' + this.props.memberRequest._id)
            .then(res => console.log(res.data));

        window.location = '/requests';
    }

    goToSurveyManagement() {
        window.location = "/survey-management/" + this.props.memberRequest.data[0];
    }

    render() {
        return (
            <div className="box box-primary collapsed-box">
                <div className="box-header with-border">
                    <div className="user-block">
                        <img className="img-circle" src={this.state.user.role === "ADMIN" ?
                            "/dist/img/admin.png"
                            : this.state.user.role === "RESEARCHER" ?
                                "/dist/img/researcher.png"
                                : "/dist/img/responder.png"
                        } alt="User" />
                        <span className="username"><a onClick={() => window.location = "/user-profile/" + this.state.user._id}> {this.state.user.firstname + " " + this.state.user.lastname} </a></span>
                        <span className="description">ต้องการเชิญคุณเข้าร่วมกลุ่มทำแบบสอบถาม</span>
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
                            <button style={{ width: "200px" }} className="btn btn-primary" onClick={this.agree}>เข้าร่วม</button>
                        </div>
                        <div className="col-md-6">
                            <button style={{ width: "200px" }} className="btn btn-danger" onClick={this.disagree}>ไม่เข้าร่วม</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

MemberRequest.propTypes = {
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps)(MemberRequest);