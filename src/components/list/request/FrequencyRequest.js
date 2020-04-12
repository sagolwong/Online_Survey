import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

class FrequencyRequest extends Component {
    constructor(props) {
        super(props);

        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear() + 543;

        this.state = {
            survey: {},
            user: {},
            frequency: [],
            followResult: [],
            checkDoneDate: false,
            nowDate: date,
            nowMonth: month,
            nowYear: year
        };
        this.checkFrequency = this.checkFrequency.bind(this);
        this.agree = this.agree.bind(this);
        this.disagree = this.disagree.bind(this);
    }

    async componentDidMount() {
        const userId = this.props.auth.user.id;
        const surveyId = this.props.frequencyRequest.data[0];
        const frequencyId = this.props.frequencyRequest.data[1];
        const userId2 = this.props.frequencyRequest.data[2];
        const date = this.state.nowDate + "-" + this.state.nowMonth + "-" + this.state.nowYear

        await axios.get('/surveys/find/' + surveyId)
            .then(response => {
                this.setState({
                    survey: response.data
                })
                console.log(this.state.survey);
            })
            .catch((error) => {
                console.log(error);
            })

        await axios.get('/users/' + userId2)
            .then(response => {
                this.setState({
                    user: response.data
                })
                console.log(this.state.user);
            })
            .catch((error) => {
                console.log(error);
            })

        await axios.get('/frequency/' + frequencyId)
            .then(response => {
                this.setState({
                    frequency: response.data.listTimeToDo
                })
                console.log(response.data);
                console.log(this.state.frequency);
            })
            .catch((error) => {
                console.log(error);
            })

        await axios.get(`/followResults/find/${surveyId}/${userId}`)
            .then(response => {
                this.setState({
                    followResult: response.data
                })
                console.log(this.state.followResult[0]);

            })
            .catch((error) => {
                console.log(error);
            })

        if (await this.state.followResult[0] !== undefined) {
            this.state.followResult[0].follow.map(dates => {
                if (dates === date) {
                    this.setState({ checkDoneDate: true })
                }
            })
        }
        console.log(this.state.checkDoneDate);

    }

    async agree() {
        const surveyId = this.props.frequencyRequest.data[0];

        window.location = '/online-survey/' + surveyId;
    }

    disagree() {
        axios.delete('/requests/' + this.props.frequencyRequest._id)
            .then(res => console.log(res.data));

        window.location = '/requests';
    }

    goToSurveyManagement() {
        window.location = "/survey-management/" + this.props.frequencyRequest.data[0];
    }

    checkFrequency() {
        if (this.state.frequency[0] !== undefined) {
            return (
                this.state.frequency.map(time => {
                    if (time.day === this.state.nowDate && time.month === this.state.nowMonth && time.year === this.state.nowYear) {
                        if (this.state.checkDoneDate) return "";
                        else {
                            return (
                                <div className="box box-success collapsed-box">
                                    <div className="box-header with-border">
                                        <div className="user-block">
                                            <img className="img-circle" src="/../dist/img/user1-128x128.jpg" alt="User" />
                                            <span className="username"><a onClick={() => window.location = "/user-profile/" + this.state.user._id}> {this.state.user.firstname + " " + this.state.user.lastname} </a></span>
                                            <span className="description">วันนี้คุณมีนัดทำแบบสอบถาม : {this.state.survey.nameSurvey}</span>
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
                                                <button style={{ width: "200px" }} className="btn btn-primary" onClick={this.agree}>ทำ</button>
                                            </div>
                                            <div className="col-md-6">
                                                <button style={{ width: "200px" }} className="btn btn-danger" onClick={this.disagree}>ไม่ทำ</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                    }
                })
            )

        }

    }

    render() {
        return (
            <div>
                {this.checkFrequency()}
            </div>
        )
    }
}

FrequencyRequest.propTypes = {
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps)(FrequencyRequest);