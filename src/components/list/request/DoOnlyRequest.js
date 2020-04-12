import React, { Component } from 'react'
import axios from 'axios';

export default class DoOnlyRequest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            survey: {},
            user: {},
            check: ""
        };
        this.agree = this.agree.bind(this);
        this.disagree = this.disagree.bind(this);
    }

    componentDidMount() {
        const surveyId = this.props.doOnlyRequest.data[0];
        const userId = this.props.doOnlyRequest.data[1];

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
        const surveyId = this.props.doOnlyRequest.data[0];

        await axios.delete('/requests/' + this.props.doOnlyRequest._id)
            .then(res => console.log(res.data));

        window.location = '/online-survey/' + surveyId;
    }

    disagree() {
        axios.delete('/requests/' + this.props.doOnlyRequest._id)
            .then(res => console.log(res.data));

        window.location = '/requests';
    }

    goToSurveyManagement() {
        window.location = "/survey-management/" + this.props.doOnlyRequest.data[0];
    }

    render() {
        return (
            <div className="box box-success collapsed-box">
                <div className="box-header with-border">
                    <div className="user-block">
                        <img className="img-circle" src="/../dist/img/user1-128x128.jpg" alt="User" />
                        <span className="username"><a onClick={() => window.location = "/user-profile/" + this.state.user._id}> {this.state.user.firstname + " " + this.state.user.lastname} </a></span>
                        <span className="description">ต้องการเชิญคุณทำแบบสอบถาม</span>
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
