import { HOME } from './routes';
//React
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
//Redux
import { connect } from 'react-redux';

const AuthRoute = ({ component: Component, authenticated, compProps, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      authenticated === true ? <Redirect to={HOME} /> : <Component {...props} {...compProps} />
    }
  />
);
const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated
});
AuthRoute.propTypes = {
  user: PropTypes.object
};
export default connect(mapStateToProps)(AuthRoute);
