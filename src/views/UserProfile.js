import React, { Component } from 'react'
import axios from 'axios';
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { showComponent } from "../actions/setPageActions";
import Can from "../components/rbac/Can";

class UserProfile extends Component {

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            user: {},
            data: [],
            gender: "",
            job: "นักเรียน",
            description: "",
            countProject: 0,
            countSurvey: 0,
            countListSurvey: 0

        };
    }

    componentDidMount() {
        var userId = this.props.auth.user.id;

        if (this.props.match.params.userId) userId = this.props.match.params.userId;

        this.props.showComponent()

        axios.get('/users/' + userId)
            .then(response => {
                this.setState({
                    user: response.data
                })
                console.log(this.state.user)
            })
            .catch((error) => {
                console.log(error);
            })

        axios.get('/projects/count/' + userId)
            .then(response => {
                this.setState({
                    countProject: response.data
                })
                console.log(this.state.countProject)
            })
            .catch((error) => {
                console.log(error);
            })

        axios.get('/surveys/count/' + userId)
            .then(response => {
                this.setState({
                    countSurvey: response.data
                })
                console.log(this.state.countSurvey)
            })
            .catch((error) => {
                console.log(error);
            })

        axios.get('/listSurvey/find/' + userId)
            .then(response => {
                this.setState({
                    countListSurvey: response.data[0].listSurvey.length
                })
                console.log(this.state.countListSurvey)
            })
            .catch((error) => {
                console.log(error);
            })

    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit(e) {
        e.preventDefault();

        const userId = this.props.auth.user.id;
        this.state.data[0] = userId;
        this.state.data[1] = this.state.gender;
        this.state.data[2] = this.state.job;
        this.state.data[3] = this.state.description;

        var request = {
            userId: "5e81e73ea3b5ac1b686929e4",// ADMIN ID
            typeRequest: "upgrade",
            data: this.state.data
        }

        console.log(request);

        axios.post('/requests/create', request)
            .then(res => console.log(res.data));

        window.location = '/requests';
    }

    render() {
        return (
            <div className="content-wrapper">
                <section className="content-header">
                    <h1>
                        โปรไฟล์ส่วนตัว
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="/requests"><i className="fa fa-envelope-o"></i> คำร้องขอ</a></li>
                        <li className="active">โปรไฟล์ส่วนตัว</li>
                    </ol>
                </section>
                <br />
                <section className="content">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="box box-primary">
                                <div className="box-body box-profile">
                                    <img className="profile-user-img img-responsive img-circle" src={this.props.auth.user.role === "ADMIN" ?
                                        "/dist/img/admin.png"
                                        : this.props.auth.user.role === "RESEARCHER" ?
                                            "/dist/img/researcher.png"
                                            : "/dist/img/responder.png"
                                    } alt="User" />
                                    <h4 className="profile-username text-center">{this.state.user.firstname + " " + this.state.user.lastname}</h4>
                                    <p className="text-muted text-center">{this.state.user.role}</p>
                                    <Can
                                        role={this.state.user.role}
                                        perform="user-profile:show-more-profile"
                                        yes={() => (
                                            <div>
                                                <br />
                                                <ul className="list-group list-group-unbordered">
                                                    <li className="list-group-item">
                                                        <b>เพศ</b> <p className="pull-right">{this.state.user.gender}</p>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>อาชีพ</b> <p className="pull-right">{this.state.user.job}</p>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>โปรเจค</b> <a className="pull-right badge bg-blue">{this.state.countProject}</a>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>แบบสอบถามที่สร้าง</b> <a className="pull-right badge bg-blue">{this.state.countSurvey}</a>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>แบบสอบถามที่เคยทำ</b> <a className="pull-right badge bg-blue">{this.state.countListSurvey}</a>
                                                    </li>
                                                </ul>

                                            </div>
                                        )}
                                        no={() => ""}
                                    />
                                </div>
                            </div>
                        </div>

                        <Can
                            role={this.state.user.role}
                            perform="user-profile:upgrade"
                            yes={() => (
                                <div className="col-md-6">
                                    {this.props.match.params.userId === undefined ?
                                        <div className="box box-info">
                                            <div className="box-header with-border">
                                                <h3 className="box-title">กรอกข้อมูลเพื่ออัพเกรดเป็นนักวิจัย</h3>
                                            </div>

                                            <form onSubmit={this.onSubmit}>
                                                <div className="box-body">
                                                    <div className="form-group">
                                                        <label>เพศ:</label>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="radio">
                                                                    <label>
                                                                        <input type="radio" id="gender" name="optionsGender" defaultValue="ชาย" onChange={this.onChange} />
                                                            ชาย
                                                        </label>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="radio">
                                                                    <label>
                                                                        <input type="radio" id="gender" name="optionsGender" defaultValue="หญิง" onChange={this.onChange} />
                                                            หญิง
                                                        </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row-md-6">
                                                            <div className="form-group">
                                                                <label>อาชีพ:</label>
                                                                <select
                                                                    required
                                                                    id="job"
                                                                    className="form-control"
                                                                    value={this.state.job}
                                                                    onChange={this.onChange}>
                                                                    <option value="นักเรียน">นักเรียน</option>
                                                                    <option value="นิสิต/นักศึกษา">นิสิต/นักศึกษา</option>
                                                                    <option value="ข้าราชการ/รัฐวิสาหกิจ">ข้าราชการ/รัฐวิสาหกิจ</option>
                                                                    <option value="พนักงานบริษัทเอกชน">พนักงานบริษัทเอกชน</option>
                                                                    <option value="ธุรกิจส่วนตัว">ธุรกิจส่วนตัว</option>
                                                                    <option value="รับจ้าง">รับจ้าง</option>
                                                                    <option value="แม่บ้าน/พ่อบ้าน">แม่บ้าน/พ่อบ้าน</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="row-md-6">
                                                            <div className="form-group">
                                                                <label>ทำไมถึงอยากยกระดับเป็นผู้วิจัยจงอธิบาย: </label>
                                                                <textarea
                                                                    required
                                                                    id="description"
                                                                    className="form-control"
                                                                    value={this.state.description}
                                                                    onChange={this.onChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="box-footer text-center">
                                                    <div className="form-group">
                                                        <input type="submit" value="อัพเกรด" className="btn btn-info" />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        : ""
                                    }

                                </div>
                            )}
                            no={() => ""}
                        />
                    </div>
                </section>
            </div>
        )
    }
}

UserProfile.propTypes = {
    auth: PropTypes.object.isRequired,
    showComponent: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { showComponent })(UserProfile);