import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
//React
import React from 'react';
import { FixedSizeList } from 'react-window';
import PropTypes from 'prop-types';
// Redux stuff
import { connect } from 'react-redux';
import { getLinkSubs, approveAccess, rejectAccess } from '../../redux/actions/userActions';
//MUI
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
// Icons
import CancelIcon from '@material-ui/icons/Cancel';
import CachedIcon from '@material-ui/icons/Cached';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
//Components
import MyButton from '../../util/MyButton';
import renderSkeleton from '../../util/FollowersRowSkeleton';

function renderRow(props) {
  const { index, style, loading, errors, classes } = props;
  const data = props.data[index];
  dayjs.extend(relativeTime);
  return (
    <ListItem disabled={loading} divider style={style} key={index}>
      <div style={{ width: '100%', whiteSpace: 'nowrap' }}>
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
            {data.subHandle}
          </Typography>
          {errors.error && (
            <Typography className={classes.customError} variant="body2" >
              {errors.error}
            </Typography>
          )}
        </Box>
      </div>

      {!loading && (<div className={classes.ctrlBtn}>
        {data.type === 'requested' && (<MyButton onClick={() => props.approveAccess(data.subId)} tip="Approve">
          <ThumbUpIcon /></MyButton>)}

        <MyButton onClick={() => props.rejectAccess(data.subId, data.linkId)} tip="Reject">
          <CancelIcon /></MyButton>
      </div>
      )}

      {loading && (
        <CircularProgress className={classes.progress} size={30} />
      )}
    </ListItem>
  );
}
function mapStateToPropsRow(state, ownProps) {
  return {
    loading: state.UI.loadingLinkSub[ownProps.data[ownProps.index].subId] || false,
    errors: state.UI.errorsLinkSub[ownProps.data[ownProps.index].subId] || {},
  }
}
const mapActionsToProps = {
  approveAccess,
  rejectAccess
};
const stylesRow = (theme) => ({
  customError: theme.forms.customError,
  ctrlBtn: theme.ctrlBtn,
  ...theme.subsRow
});
const row = connect(
  mapStateToPropsRow,
  mapActionsToProps
)(withStyles(stylesRow)(renderRow));


const styles = (theme) => ({
  ...theme.listSub
});

function LinkList(props) {
  const { subs, classes, heading, loading, errors } = props;
  return (
    <div className={classes.root} >
      <Typography variant="h6" className={classes.heading}>{heading}
        {!loading && (
          <MyButton tip="Load" onClick={() => props.getLinkSubs(props.linkCode)}>
            <CachedIcon />
          </MyButton>)}
        {loading && (
          <MyButton tip="Loading">
            <CircularProgress size={20} />
          </MyButton>)}
      </Typography>

      {errors.error && (
        <Typography variant="body2" className={classes.customError}>
          {errors.error}
        </Typography>
      )}

      <FixedSizeList height={window.innerHeight - 360} width={'100%'}
        itemSize={120} itemData={subs.length ? subs : []}
        itemCount={subs.length ? subs.length : 3}  >

        {subs.length ? row : renderSkeleton}

      </FixedSizeList>
    </div>
  );
}
LinkList.propTypes = {
  classes: PropTypes.object.isRequired,
  subs: PropTypes.array.isRequired,
  heading: PropTypes.string.isRequired,
  linkCode: PropTypes.string.isRequired,
  getLinkSubs: PropTypes.func.isRequired,
};
function mapStateToPropsList(state, ownProps) {
  return {
    loading: state.UI.loadingLinkSubList[ownProps.linkCode] || false,
    errors: state.UI.errorsLinkSubList[ownProps.linkCode] || {},
    subs: state.user.linkSubs[ownProps.linkCode] || []
  }
}
const mapActionsToPropsList = {
  getLinkSubs
};
export default connect(mapStateToPropsList, mapActionsToPropsList)(withStyles(styles)(LinkList));
