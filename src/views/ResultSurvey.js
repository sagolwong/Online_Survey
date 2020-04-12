import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import axios from 'axios';

class ResultSurvey extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: ""
        }
    }

    componentDidMount() {
        const surveyId = this.props.surveyId;
        const name = this.props.name;

        axios.get(`/surveys/find/` + surveyId)
            .then(response => {
                if (response.data.shareTo === "OPEN" || response.data.shareTo === "CLOSE") {
                    this.setState({
                        name: this.props.auth.user.firstname + " " + this.props.auth.user.lastname
                    })
                } else {
                    if (this.props.name !== "") this.setState({ name: name })
                    else this.setState({ name: this.props.auth.user.firstname + " " + this.props.auth.user.lastname })

                }

            })
            .catch((error) => {
                console.log(error);
            })
    }

    goToMainPage() {
        window.location = "/requests";
    }

    render() {
        return (
            <div style={{fontSize:"30px"}}>
                <br/><br/><br/><br/>
                <div className="row text-center">
                    ขอบคุณ{this.state.name !== "NONAME" ? " คุณ"+this.state.name+" ":""}เป็นอย่างมาก
                </div>
                <div className="row text-center">
                    ที่ให้ความร่วมมือในการเก็บข้อมูลเพื่อทำงานวิจัย
                </div>
                <br/>
                <div className="row text-center">
                    <button className="btn btn-success" onClick={this.goToMainPage}>กลับสู่หน้าหลัก</button>
                </div>
            </div>
        )
    }
}

ResultSurvey.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(ResultSurvey);