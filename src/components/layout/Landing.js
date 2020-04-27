import React, { Component } from 'react'
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class Landing extends Component {

    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to request
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/requests");
        }
    }

    render() {
        return (
            <div className="container">
                <div align="center">
                    <br /><br /><br /><br /><br /><br /><br />
                    <div className="row">
                        <div className="col s12 center-align">
                            <h4>
                                <b>OnlineSurvey</b> for Reasearch
                            </h4>
                            <p className="flow-text grey-text text-darken-1">
                                ระบบแบบสำรวจออนไลน์เพื่อการวิจัยมีฟังก์ชันมากมายที่ช่วยสนับสนุนการเก็บข้อมูลเพื่อทำงานวิจัย
                            </p>
                            <p className="flow-text grey-text text-darken-1">
                                <b>สำหรับผู้วิจัย :</b> ระบบจะช่วยลดระยะเวลาและขั้นตอนในการจัดเก็บข้อมูล จัดการข้อมูล และการวิเคราะห์ข้อมูล
                            </p>
                            <p className="flow-text grey-text text-darken-1">
                                <b>สำหรับผู้ทำแบบสอบถาม :</b> ระบบจะช่วยปกป้องข้อมูลที่ได้จากผู้ทำแบบสอบถามตามหลักมาตรการการคุ้มครอง
                            </p>
                            <p className="flow-text grey-text text-darken-1">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                ความเป็นส่วนตัวของข้อมูลส่วนบุคคล หรือ ตามกฎหมาย GDPR
                            </p>
                            <br />
                            <div>
                                <Link
                                    to="/login"
                                    style={{
                                        width: "140px",
                                        borderRadius: "3px",
                                        letterSpacing: "1.5px"
                                    }}
                                    className="btn btn-success"
                                >
                                    เข้าสู่ระบบ
                                </Link>
                            </div>

                            <div>
                                <Link
                                    to="/register"
                                    style={{
                                        width: "140px",
                                        borderRadius: "3px",
                                        letterSpacing: "1.5px"
                                    }}
                                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                                >
                                    ลงทะเบียน
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

Landing.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Landing);