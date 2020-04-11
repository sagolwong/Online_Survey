import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

class FollowResult extends Component {
    constructor(props) {
        super(props);

        this.state = {
            survey: {},
            project: [],
            already: false,
            names: [],
            members: [],
            frequency: [],
            listTimeToDo: [],
            checkListTime: false,
            follower: [],
        };
        this.showTh = this.showTh.bind(this)
        this.showRow = this.showRow.bind(this)
        this.showName = this.showName.bind(this)
        this.showTD = this.showTD.bind(this)
    }

    async componentDidMount() {
        const surveyId = this.props.surveyId;

        await axios.get(`/surveys/find/` + surveyId)
            .then(response => {
                this.setState({
                    survey: response.data,
                    amountMember: response.data.names.length,
                    names: response.data.names
                })
                console.log(this.state.survey);
            })
            .catch((error) => {
                console.log(error);
            })

        if (await this.state.survey.names[0] !== undefined) {
            this.state.survey.names.map(userId => {
                axios.get(`/users/` + userId)
                    .then(response => {
                        this.setState({
                            members: this.state.members.concat(response.data)
                        })

                        console.log(this.state.members);
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            })
        }

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
            var date = []
            this.state.listTimeToDo.map(dates => {
                date = date.concat(dates.day + "/" + dates.month + "/" + dates.year);
            })
            this.setState({
                listTimeToDo: date,
                checkListTime: true
            })
            console.log(this.state.listTimeToDo);
        }
        if (await this.state.survey !== undefined) {
            axios.get('/followResults/findS/' + surveyId)
                .then(response => {
                    this.setState({
                        follower: response.data,
                    })
                    console.log(this.state.follower);

                })
                .catch((error) => {
                    console.log(error);
                })
        }

        await axios.get(`/projects/find/` + this.state.survey.userId)
            .then(response => {
                this.setState({
                    project: response.data,
                    already: true
                })
                console.log(this.state.project[0]);
            })
            .catch((error) => {
                console.log(error);
            })

    }

    showTh() {
        return (
            this.state.listTimeToDo.map(date => {
                return (
                    <th>{date}</th>
                )
            })
        )
    }

    showRow() {
        return (
            this.state.follower.map((user, index) => {
                return (
                    <tr>
                        <th scope="row">{this.showName(index)}</th>
                        {this.showTD(index)}
                    </tr>
                )
            })
        )
    }

    showName(index) {
        return (
            this.state.members.map(mem => {
                if (mem._id === this.state.follower[index].userId) {
                    return mem.firstname + " " + mem.lastname;
                }
            })
        )
    }

    showTD(index) {
        return (
            this.state.listTimeToDo.map(dates => {
                var check = false;
                this.state.follower[index].follow.map((date, i) => {
                    if (dates === date) {
                        check = true;
                    }
                })
                if (check) return <td>/</td>
                else return <td>-</td>
            })
        )
    }

    goToProject() {
        window.location = "/project-management/" + this.state.survey.projectId
    }

    showTable() {
        return (
            <div>
                <section className="content-header">
                    <h1>
                        <i className="fa fa-file-text-o" /> {this.state.survey.nameSurvey}
                    </h1>
                    <ol className="breadcrumb">
                        <li ><a href="/requests"><i className="fa fa-envelope-o" /> คำร้องขอ</a></li>
                        <li ><a onClick={this.goToProject.bind(this)}><i className="fa fa-folder-o" /> {this.state.project[0].nameProject}</a></li>
                        <li className="active"><i className="fa fa-file-text-o" /> {this.state.survey.nameSurvey}</li>
                    </ol>
                </section>
                <br />
                <section className="content">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <h3 class="box-title">ติดตามผลการทำแบบสอบถาม</h3>
                                </div>
                                <div class="box-body">
                                    <table id="example2" class="table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th>ชื่อ-นามสกุล</th>
                                                {this.state.checkListTime ? this.showTh() : ""}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.checkListTime ? this.showRow() : ""}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.state.already ?
                    this.state.frequency[0] !== undefined ?
                        this.showTable()
                        : <div className="row text-center" style={{fontSize:"25px"}}>
                            <br/><br/><br/><br/><br/><br/><br/>
                            <i className="fa fa-ban" /> ไม่ได้ตั้งค่าให้สามารถใช้งานฟังก์ชันนี้ได้
                        </div>

                    : <div style={{fontSize:"25px"}}>
                        <br/><br/><br/><br/><br/><br/>
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

FollowResult.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(FollowResult);