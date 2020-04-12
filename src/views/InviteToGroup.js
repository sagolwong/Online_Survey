import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

class InviteToGroup extends Component {
    constructor(props) {
        super(props);

        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear() + 543;

        this.state = {
            survey: {},
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
        const surveyId = this.props.match.params.surveyId;
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
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

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
                            <h3 className="box-title">คำร้องขอเชิญท่านเข้าร่วมกลุ่มสำหรับทำแบบสอบถาม</h3>
                        </div>

                        <div className="box-body text-center">
                            <div className="row">
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
        const surveyId = this.props.match.params.surveyId;
        var check = false;
        var member = {
            names: this.state.survey.names.concat(userId),
        }

        await axios.post(`/surveys/member/${this.props.match.params.surveyId}`, member)
            .then(res => console.log(res.data));

        await axios.get('/frequency/find/' + surveyId)
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
            console.log(followResult);
            axios.post(`/followResults/create`, followResult)
                .then(res => { console.log(res.data) });

        }
        if (await this.state.listTimeToDo[0] !== undefined) {
            this.state.listTimeToDo.map(time => {
                if (time.day === this.state.nowDate && time.month === this.state.nowMonth && time.year === this.state.nowYear) {
                    check = true;
                }
            })
        } else window.location = `/online-survey/${surveyId}`;

        if (await check) window.location = `/online-survey/${surveyId}`;
        else window.location = `/requests`;

    }

    goToAgreement() {
        window.location = `/online-survey/${this.props.match.params.surveyId}`;
    }

    render() {
        return (
            <div className="bg-blank-page">
                {this.state.checkGroup ? this.checkGroup() : this.goToAgreement()}
            </div>
        )
    }
}

InviteToGroup.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(InviteToGroup);