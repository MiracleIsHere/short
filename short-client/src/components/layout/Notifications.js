import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
//React
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList } from 'react-window';
// MUI stuff
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
// Icons
import NotificationsIcon from '@material-ui/icons/Notifications';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import CancelIcon from '@material-ui/icons/Cancel';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
// Redux
import { connect } from 'react-redux';
import { markNotificationsRead, markNotificationsUIRead, approveAccess, rejectAccess } from '../../redux/actions/userActions';
//Components
import MyButton from '../../util/MyButton';
import renderSkeleton from '../../util/FollowersRowSkeleton';

function renderRow(props) {
  const { index, style, loading, errors, classes } = props;
  const data = props.data[index];

  const errorMarkup = errors && (errors.error && (
    <Typography className={classes.customError} variant="body2" >
      {errors.error}
    </Typography>
  ))

  const verb = data.type === 'requested' ? 'Requested by ' : 'Granted by '
  dayjs.extend(relativeTime);
  return (
    <ListItem disabled={loading} divider style={style} key={index}>

      {(!data.read || data.read === 'just read') && (
        <Box
          component="div"
          position='absolute'
          left="0"
          top="0"
        >
          <MyButton tip="New">
            <NewReleasesIcon /></MyButton>
        </Box>)}

      <div style={{ width: '100%', whiteSpace: 'nowrap', }}>
        <Box
          component="div"
          my={0}
          textOverflow="ellipsis"
          overflow="hidden"
        >
          <Typography variant="body2" color="textSecondary">
            {dayjs(data.createdAt).fromNow()}
          </Typography>
        </Box>
        <Box component="div" my={1} overflow="auto" >
          <Typography variant="h5" color="primary">
            /{data.linkId}
          </Typography>
        </Box>
        <Box
          component="div"
          my={0}
          overflow="auto"
        >
          <b>{verb}</b>
          {data.sender}
        </Box>
        <Box
          component="div"
          my={0}
          overflow="auto"
        >
          {errorMarkup}
        </Box>
      </div>
      {loading && (
        <CircularProgress className={classes.progress} size={30} />
      )}

      {!loading && (<div className={classes.ctrlBtn}>
        {data.type === 'requested' && (<><MyButton onClick={() => props.approveAccess(data.subId)} tip="Approve">
          <ThumbUpIcon /></MyButton>
          <MyButton onClick={() => props.rejectAccess(data.subId, data.linkId)} tip="Reject">
            <CancelIcon /></MyButton></>)}
      </div>
      )}
    </ListItem>
  );
}

function mapStateToPropsRow(state, ownProps) {
  let currentObj = ownProps.data[ownProps.index]
  if (currentObj.type !== 'requested') return {}
  return {
    loading: state.UI.loadingLinkSub[currentObj.subId] || false,
    errors: state.UI.errorsLinkSub[currentObj.subId] || {},
  }
}
function mapActionsToProps(dispatch, ownProps) {
  let currentObj = ownProps.data[ownProps.index]
  if (currentObj.type !== 'requested') return {}
  return {
    approveAccess: subId => dispatch(approveAccess(subId)),
    rejectAccess: (subId, linkId) => dispatch(rejectAccess(subId, linkId)),
  }
}
const stylesRow = (theme) => ({
  customError: theme.forms.customError,
  ctrlBtn: theme.ctrlBtn,
  ...theme.subsRow
});
const row = connect(
  mapStateToPropsRow,
  mapActionsToProps
)(withStyles(stylesRow)(renderRow));




class Notifications extends Component {
  state = {
    anchorEl: null
  };
  handleOpen = (event) => {
    this.setState({ anchorEl: event.target });
  };
  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  onMenuOpened = () => {
    let unreadNotificationsIds = this.props.notifications
      .filter((not) => !not.read)
      .map((not) => not.subId);
    this.props.markNotificationsRead(unreadNotificationsIds);
  };
  render() {
    const notifications = this.props.notifications;
    const anchorEl = this.state.anchorEl;

    dayjs.extend(relativeTime);

    let notificationsIcon;
    if (notifications && notifications.length > 0) {
      notifications.filter((not) => not.read === false).length > 0
        ? (notificationsIcon = (
          <Badge
            badgeContent={
              notifications.filter((not) => not.read === false).length
            }
            color="secondary"
          >
            <NotificationsIcon />
          </Badge>
        ))
        : (notificationsIcon = <NotificationsIcon />);
    } else {
      notificationsIcon = <NotificationsIcon />;
    }
    return (
      <Fragment>
        <Tooltip placement="top" title="Notifications">
          <IconButton
            aria-owns={anchorEl ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
          >
            {notificationsIcon}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          onEnter={this.onMenuOpened}
          onExit={() => this.props.markNotificationsUIRead()}
        >
          <FixedSizeList height={window.innerHeight - 360}
            width={'300px'}
            itemSize={150} itemData={notifications.length ? notifications : []}
            itemCount={notifications.length ? notifications.length : 3}  >

            {notifications.length ? row : renderSkeleton}

          </FixedSizeList>
        </Menu>
      </Fragment>
    );
  }
}

Notifications.propTypes = {
  markNotificationsRead: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired
};
const mapStateToProps = (state) => ({
  notifications: state.user.notifications
});
export default connect(
  mapStateToProps,
  { markNotificationsRead, markNotificationsUIRead }
)(Notifications);
