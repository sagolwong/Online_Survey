import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

import SurveyProfile from '../../views/SurveyProfile';
import SideMenu from '../layout/SideMenu';
import ManageSurvey from '../../views/ManageSurvey';
import ManageAnswer from '../../views/ManageAnswer';
import FollowResult from '../../views/FollowResult';

class baseManageSurvey extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pageManage: "survey-profile",
            checkOwnSurvey: false
        };
    }

    componentDidMount() {
        const surveyId = this.props.match.params.surveyId;
        const userId = this.props.auth.user.id;

        axios.get(`/surveys/find/` + surveyId)
            .then(response => {
                this.setState({
                    survey: response.data,
                })
                console.log(this.state.survey);

                if (response.data.userId === userId) this.setState({ checkOwnSurvey: true })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    onChangePageManage = data =>{
        this.setState({
            pageManage: data
        })
    }

    showComponent() {
        if (this.state.pageManage === "survey-profile") return <SurveyProfile surveyId={this.props.match.params.surveyId} />
        else if(this.state.pageManage === "manage-survey") return <ManageSurvey surveyId={this.props.match.params.surveyId}/>
        else if(this.state.pageManage === "manage-answer") return <ManageAnswer surveyId={this.props.match.params.surveyId}/>
        else if(this.state.pageManage === "follow-result") return <FollowResult surveyId={this.props.match.params.surveyId}/>
    }

    render() {
        return (
            <div className="bg-sideMenu">
                <SideMenu selected={this.state.pageManage} surveyId={this.props.match.params.surveyId} ChangePage={this.onChangePageManage}/>
               <div className="content-wrapper">
                  {this.showComponent()} 
               </div>
                
            </div>
        )
    }
}

baseManageSurvey.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(baseManageSurvey);