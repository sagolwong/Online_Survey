import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const PrivateAdminRoute = ({ component: Component, auth, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            auth.isAuthenticated === true ?
                auth.user.role === "ADMIN" ?
                    (<Component {...props} />) : (<Redirect to="/error-page" />)
                : (
                    <Redirect to="/login" />
                )
        }
    />
);

PrivateAdminRoute.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateAdminRoute);