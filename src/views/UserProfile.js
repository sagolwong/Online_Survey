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
            description: ""

        };
    }

    componentDidMount() {
        const userId = this.props.auth.user.id;

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
                        <li><a href="/requests"><i className="fa fa-bell-o"></i> คำร้องขอ</a></li>
                        <li className="active">โปรไฟล์ส่วนตัว</li>
                    </ol>
                </section>
                <br />
                <section className="content">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <h3 className="box-title">โปรไฟล์</h3>
                                </div>
                                <div className="box-body text-center">
                                    <img src="dist/img/user2-160x160.jpg" alt="User" />
                                    <h4>{this.props.auth.user.firstname + " " + this.props.auth.user.lastname}</h4>
                                    <small>{this.props.auth.user.role}</small>
                                    <br />
                                    <Can
                                        role={this.props.auth.user.role}
                                        perform="user-profile:show-more-profile"
                                        yes={() => (
                                            <div>
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>เพศ :</label>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <p>{this.state.user.gender}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>อาชีพ :</label>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <p>{this.state.user.job}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        no={() => ""}
                                    />
                                </div>
                            </div>
                        </div>

                        <Can
                            role={this.props.auth.user.role}
                            perform="user-profile:upgrade"
                            yes={() => (
                                <div className="col-md-6">
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