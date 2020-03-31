import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from 'reactstrap';

import { showComponent } from "../actions/setPageActions";

class Requests extends Component {

    componentDidMount(){
        this.props.showComponent()
    }

    render() {
        return (
            <div>

            </div>
        )
    }
}
Requests.propTypes = {
    showComponent: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps, { showComponent })(Requests);