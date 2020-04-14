import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

class ManageSurvey extends Component {
    constructor(props) {
        super(props);

        this.showListUser = this.showListUser.bind(this);
        this.showListName = this.showListName.bind(this);
        this.showMemberGroup = this.showMemberGroup.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
        this.changeStatusSurvey = this.changeStatusSurvey.bind(this);
        this.closeSurvey = this.closeSurvey.bind(this);
        this.cancel = this.cancel.bind(this);

        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear() + 543;

        this.state = {
            survey: {},
            project: [],
            already: false,
            users: [],
            names: [],
            amountMember: 0,
            members: [],
            listUser: [],
            listName: [],
            search: "",
            update: false,
            ownSurvey: true,
            showLinkInvite: false,
            nowDate: date,
            nowMonth: month,
            nowYear: year,
            sdate: 0,
            smonth: 0,
            syear: 0,
            edate: 0,
            emonth: 0,
            eyear: 0,
        };
    }

    async componentDidMount() {
        const surveyId = this.props.surveyId;

        await axios.get(`/users/`)
            .then(response => {
                this.setState({
                    users: response.data
                })

                console.log(this.state.listUser);
            })
            .catch((error) => {
                console.log(error);
            })

        await axios.get(`/surveys/find/` + surveyId)
            .then(response => {
                this.setState({
                    survey: response.data,
                    amountMember: response.data.names.length,
                    names: response.data.names,
                    sdate: response.data.openAndCloseTimes.start.day,
                    smonth: response.data.openAndCloseTimes.start.month,
                    syear: response.data.openAndCloseTimes.start.year,
                    edate: response.data.openAndCloseTimes.end.day,
                    emonth: response.data.openAndCloseTimes.end.month,
                    eyear: response.data.openAndCloseTimes.end.year,
                })
                console.log(this.state.survey);
                if ((this.state.nowYear <= this.state.syear && (this.state.nowMonth < this.state.smonth || (this.state.nowDate < this.state.sdate && this.state.nowDate >= this.state.sdate))) || (this.state.nowMonth === this.state.smonth && this.state.nowDate < this.state.sdate)) {
                    this.setState({ showLinkInvite: true })
                }
            })
            .catch((error) => {
                console.log(error);
            })

        if (await this.state.survey.userId !== this.props.auth.user.id) {
            this.setState({
                ownSurvey: false
            })
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
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.update !== this.state.update) {
            axios.get(`/surveys/find/` + this.props.surveyId)
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
        }
    }

    updateSearch(e) {
        this.setState({
            search: e.target.value.substr(0, 20)
        })
    }

    showListUser() {
        let filterUser = this.state.users.filter(user => {
            return user.firstname.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
        })
        if (this.state.search !== "") {
            return (
                <div className="box box-default">
                    <div className="box-body">
                        {filterUser.map(user => {
                            return <ul className="listAddName"><p onClick={() => {
                                this.setState(({ listName, listUser, search }) => {
                                    const mlistName = [...listName]
                                    const mlistUser = [...listUser]
                                    mlistName.splice(0, 0, user.firstname + "  " + user.lastname)
                                    mlistUser.splice(0, 0, user._id)
                                    return { listName: mlistName, listUser: mlistUser, search: "" }
                                })
                            }}>{user.firstname} {user.lastname}</p></ul >
                        })}
                    </div>
                </div>

            )
        }
    }

    showListName() {
        return (
            this.state.listName.map((name, index) => {
                return (
                    <ul>
                        <div className="row">
                            <div className="col-md-6">
                                <h4>{name}</h4>
                            </div>
                            <div className="col-md-6">
                                <button className="btn btn-danger pull-right" onClick={() => {
                                    this.setState(({ listName, listUser }) => {
                                        const mlistName = [...listName]
                                        const mlistUser = [...listUser]
                                        mlistName.splice(index, 1)
                                        mlistUser.splice(index, 1)
                                        return { listName: mlistName, listUser: mlistUser }
                                    })
                                }}>ลบออกจากรายการ</button>
                            </div>
                        </div>
                        {console.log(this.state.listUser)}
                        {console.log(this.state.listName)}
                    </ul>
                )
            })
        )
    }

    sendRequest() {
        var data = [];
        data = data.concat(this.props.surveyId);
        data = data.concat(this.props.auth.user.id);

        if (this.state.survey.haveGroup) {
            this.state.listUser.map(userId => {
                var request = {
                    userId: userId,
                    typeRequest: "member",
                    data: data
                }
                console.log(request);
                axios.post('/requests/create', request)
                    .then(res => console.log(res.data));
            })
            this.setState({
                listUser: [],
                listName: []
            })
        } else if (!this.state.survey.haveGroup) {
            this.state.listUser.map(userId => {
                var request = {
                    userId: userId,
                    typeRequest: "doOnly",
                    data: data
                }
                console.log(request);
                axios.post('/requests/create', request)
                    .then(res => console.log(res.data));
            })
            this.setState({
                listUser: [],
                listName: []
            })
        }
    }

    cancel() {
        this.setState({
            listUser: [],
            listName: []
        })
    }

    showMemberGroup() {
        return (
            this.state.members.map((member, index) => {
                if (member !== null) {
                    return (
                        <ul>
                            <div className="row">
                                <div className="col-md-6">
                                    {member.firstname}  {member.lastname}
                                </div>
                                <div className="col-md-6">
                                    <button className="btn btn-danger pull-right" onClick={() => {
                                        this.setState(({ members }) => {
                                            const mlistMember = [...members]
                                            mlistMember.splice(index, 1)
                                            return { members: mlistMember }
                                        })
                                        this.deleteMember(index)
                                    }}>ลบรายชื่อออกจากกลุ่ม</button>
                                </div>
                            </div>
                        </ul>
                    )
                }
            })
        )
    }

    async deleteMember(index1) {
        await this.state.names.map((userId, index2) => {
            if (this.state.members[index1]._id === userId) {
                this.setState(({ names }) => {
                    const mlistNames = [...names]
                    mlistNames.splice(index2, 1)
                    return { names: mlistNames }
                })
            }
        })
        var member = {
            names: this.state.names
        }
        console.log(member);
        await axios.post(`/surveys/member/${this.props.surveyId}`, member)
            .then(res => console.log(res.data));

        this.setState({
            update: !this.state.update
        })
    }

    showStatus() {
        if (this.state.survey.status === "ONLINE") return <small><i className="fa fa-circle text-success" /> ออนไลน์</small>
        else if (this.state.survey.status === "PAUSE") return <small><i className="fa fa-circle text-warning" /> หยุดรับข้อมูลชั่วคราว</small>
        else if (this.state.survey.status === "FINISH") return <small><i className="fa fa-circle text-danger" /> ปิดรับข้อมูล</small>
    }

    changeStatusSurvey() {
        if (this.state.survey.status === "ONLINE") {
            var status = {
                status: "PAUSE"
            }
            console.log(status);
            axios.post(`/surveys/status/${this.state.survey._id}`, status)
                .then(res => {
                    console.log(res.data)
                    window.location = "/survey-management/" + this.state.survey._id
                });

        } else if (this.state.survey.status === "PAUSE") {
            var status = {
                status: "ONLINE"
            }
            console.log(status);
            axios.post(`/surveys/status/${this.state.survey._id}`, status)
                .then(res => {
                    console.log(res.data)
                    window.location = "/survey-management/" + this.state.survey._id
                });
        }
    }

    closeSurvey() {
        var status = {
            status: "FINISH"
        }
        console.log(status);
        axios.post(`/surveys/status/${this.state.survey._id}`, status)
            .then(res => {
                console.log(res.data)
                window.location = "/survey-management/" + this.state.survey._id
            });
    }

    showButtonAction() {
        if (this.state.survey.status === "ONLINE") {
            return (
                <div className="btn-group">
                    <button type="button" className="btn btn-warning" onClick={this.changeStatusSurvey}>หยุดรับข้อมูลชั่วคราว</button>
                    <button type="button" className="btn btn-warning dropdown-toggle" data-toggle="dropdown">
                        <span className="caret" />
                        <span className="sr-only">Toggle Dropdown</span>
                    </button>
                    <ul className="dropdown-menu" role="menu">
                        <li><a onClick={this.closeSurvey}>ปิดรับข้อมูล</a></li>
                    </ul>
                </div>
            )
        }
        else if (this.state.survey.status === "PAUSE") {
            return (
                <div className="btn-group">
                    <button type="button" className="btn btn-success" onClick={this.changeStatusSurvey}>รับข้อมูลต่อ</button>
                    <button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown">
                        <span className="caret" />
                        <span className="sr-only">Toggle Dropdown</span>
                    </button>
                    <ul className="dropdown-menu" role="menu">
                        <li><a onClick={this.closeSurvey}>ปิดรับข้อมูล</a></li>
                    </ul>
                </div>
            )
        }
        else if (this.state.survey.status === "FINISH") return "";
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
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-addon"><i className="fa fa-user-plus" /></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={this.state.survey.haveGroup ? "เพิ่มรายชื่อผู้ที่ต้องการให้เข้าร่วมกลุ่มทำแบบสอบถาม" : "เพิ่มรายชื่อผู้ที่ต้องการให้ทำแบบสอบถาม"}
                                    value={this.state.search}
                                    onChange={this.updateSearch.bind(this)}
                                />

                            </div>
                            {this.showListUser()}
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="input-group-btn">
                                        <button type="button" className="btn btn-info dropdown-toggle" data-toggle="dropdown">สร้างลิงค์ +  <span className="fa fa-caret-down" /></button>
                                        <ul className="dropdown-menu">
                                            {this.state.survey.haveGroup ?
                                                <li>
                                                    <a data-toggle="modal" data-target="#modal1"> สำหรับเชิญทำแบบสอบถาม </a>
                                                    {this.state.showLinkInvite ?
                                                        <a data-toggle="modal" data-target="#modal2"> สำหรับเชิญเข้าร่วมกลุ่มทำแบบสอบถาม </a>
                                                        : ""
                                                    }
                                                </li>
                                                :
                                                <li><a data-toggle="modal" data-target="#modal1"> สำหรับเชิญทำแบบสอบถาม </a></li>
                                            }
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    {this.showButtonAction()}
                                </div>
                            </div>
                        </div>
                        <div className="modal fade" id="modal1">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">×</span></button>
                                        <h4 className="modal-title">ลิงค์สำหรับเชิญทำแบบสอบถาม</h4>
                                    </div>
                                    <div className="modal-body">
                                        <div class="input-group">
                                            <input type="text" className="form-control" value={"http://localhost:3000/online-survey/" + this.props.surveyId} readOnly />
                                            <span class="input-group-btn">
                                                <button type="button" className="btn btn-success btn-flat" onClick={() => { navigator.clipboard.writeText("http://localhost:3000/online-survey/" + this.props.surveyId) }}><i className="fa fa-clipboard" /></button>
                                            </span>
                                        </div>
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
                                        <h4 className="modal-title">ลิงค์สำหรับเชิญเข้าร่วมกลุ่มทำแบบสอบถาม</h4>
                                    </div>
                                    <div className="modal-body">
                                        <div class="input-group">
                                            <input type="text" className="form-control" value={"http://localhost:3000/invite-to-group/" + this.props.surveyId} readOnly />
                                            <span class="input-group-btn">
                                                <button type="button" class="btn btn-success btn-flat" onClick={() => { navigator.clipboard.writeText("http://localhost:3000/invite-to-group/" + this.props.surveyId) }}><i className="fa fa-clipboard" /></button>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-default pull-right" data-dismiss="modal">ปิด</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    {this.state.listName[0] !== undefined ?
                        <div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="box box-default">
                                        <div className="box-header with-border">
                                            <h3 className="box-title">{this.state.survey.haveGroup ? "รายชื่อผู้ที่ต้องการให้เข้าร่วมกลุ่มทำแบบสอบถาม" : "รายชื่อผู้ที่ต้องการให้ทำแบบสอบถาม"}</h3>
                                        </div>

                                        <div className="box-body">
                                            {this.showListName()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <button className="btn btn-danger pull-right" onClick={this.cancel}>ยกเลิก</button>
                                    <button className="btn btn-primary pull-right" onClick={this.sendRequest}>ส่งคำขอ</button>
                                </div>
                            </div>
                        </div>
                        : ""
                    }
                    <br />
                    <div className="row-md-6">
                        <div className="box box-info">
                            <div className="box-header with-border text-center">
                                <h3 className="box-title">รายชื่อผู้เข้าร่วมกลุ่มทำแบบสอบถาม</h3>
                            </div>

                            <div className="box-body">
                                {this.state.survey.haveGroup ? <div >{this.showMemberGroup()}</div> : <div align="center"><i class="fa fa-ban" /> ไม่ได้ตั้งค่าให้ใช้งานส่วนนี้ได้</div>}
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

ManageSurvey.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(ManageSurvey);