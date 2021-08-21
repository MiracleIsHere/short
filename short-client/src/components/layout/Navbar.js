import {
  HOME,
  APP_LOGIN
} from '..//../util/routes';
//React
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// MUI stuff
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
//Redux
import { connect } from 'react-redux';
//Components
import MyButton from '../../util/MyButton';
import Notifications from './Notifications';
import CustomMenu from './CustomMenu';
// Icons
import HomeIcon from '@material-ui/icons/Home';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';

class Navbar extends Component {
  render() {
    const { authenticated } = this.props;
    return (
      <AppBar>
        <Toolbar className="nav-container">
          {authenticated ? (
            <Fragment>
              <Link to={HOME}>
                <MyButton tip="Home">
                  <HomeIcon />
                </MyButton>
              </Link>
              <Notifications />
              <CustomMenu />
            </Fragment>
          ) : (
              <Fragment>
                <Link to={HOME}>
                  <MyButton tip="Home">
                    <HomeIcon />
                  </MyButton>
                </Link>
                <Link to={APP_LOGIN}>
                  <MyButton tip="Login">
                    <MeetingRoomIcon />
                  </MyButton>
                </Link>
              </Fragment>
            )}
        </Toolbar>
      </AppBar>
    );
  }
}
Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};
const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated
});
export default connect(
  mapStateToProps)(Navbar);
