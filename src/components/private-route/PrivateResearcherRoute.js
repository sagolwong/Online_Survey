import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const PrivateResearcherRoute = ({ component: Component, auth, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            auth.isAuthenticated === true ?
                auth.user.role === "RESEARCHER" || auth.user.role === "ADMIN" ?
                    (<Component {...props} />) : (<Redirect to="/error-page" />)
                : (
                    <Redirect to="/login" />
                )
        }
    />
);

PrivateResearcherRoute.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateResearcherRoute);