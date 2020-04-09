import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

import { showComponent } from "../actions/setPageActions";

class Surveys extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: {},
            listSurvey: [],
            surveys: [],
            name: ""
        }
        this.showListSurvey = this.showListSurvey.bind(this);
    }

    async componentDidMount() {
        const userId = this.props.auth.user.id;

        this.props.showComponent();

        await axios.get('/users/5dc9a42c824eb44fe43c8f94')
            .then(response => {
                this.setState({
                    profile: response.data
                })
            })
            .catch((error) => {
                console.log(error);
            })
        await axios.get('/listSurvey/find/' + userId)
            .then(response => {
                this.setState({
                    listSurvey: response.data[0].listSurvey
                })
                console.log(typeof this.state.listSurvey)
                console.log(response.data[0].listSurvey)
            })
            .catch((error) => {
                console.log(error);
            })
        await this.state.listSurvey.map(res => {
            axios.get('/surveys/find/' + res)
                .then(response => {
                    this.setState({
                        surveys: this.state.surveys.concat(response.data)
                    })
                    console.log(this.state.surveys)

                })
                .catch((error) => {
                    console.log(error);
                })
        })
    }

    showListSurvey() {
        return (
            this.state.surveys.map(res => {
                return //<ListSurveyReadOnly survey={res}/>
        })
        )

    }

    render() {
        return (
            <div className="content-wrapper">
                <section className="content-header">
                    <h1>
                        แบบสอบถาม
                    </h1>
                    <ol className="breadcrumb">
                        <li ><a href="/requests"><i className="fa fa-bell-o"></i> คำร้องขอ</a></li>
                        <li className="active">แบบสอบถาม</li>
                    </ol>
                </section>
                <br />
                <section className="content">

                    <div className="box box-warning box-solid">
                        <div className="box-header with-border">
                            <h3 className="box-title">รายการแบบสอบถาม</h3>
                        </div>
                    </div>
                    
                    {this.showListSurvey()}
                </section>
            </div>
        )
    }
}

Surveys.propTypes = {
    showComponent: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps, { showComponent })(Surveys);