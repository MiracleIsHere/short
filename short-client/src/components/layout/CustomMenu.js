//React
import React from 'react';
import PropTypes from 'prop-types';
//MUI
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Tooltip from '@material-ui/core/Tooltip';
//Icons
import AccountCircle from '@material-ui/icons/AccountCircle';
//Redux
import { connect } from 'react-redux';
import { logoutUser } from '../../redux/actions/userActions';

function CustomMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    props.logoutUser();
  };
  return (
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <Tooltip placement="top" title="Account">
          <AccountCircle />
        </Tooltip>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        {props.handle && (
          <MenuItem >ID: {props.handle}</MenuItem>
        )}
        <MenuItem onClick={handleLogout} style={{ justifyContent: "center" }}>LOGOUT</MenuItem>
      </Menu>
    </div>
  );
}
CustomMenu.propTypes = {
  logoutUser: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  handle: state.user.credentials.handle
});
const mapActionsToProps = { logoutUser };
export default connect(
  mapStateToProps,
  mapActionsToProps)(CustomMenu);
