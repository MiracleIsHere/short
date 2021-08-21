import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
//React
import React from 'react';
import { FixedSizeList } from 'react-window';
import PropTypes from 'prop-types';
// Redux stuff
import { connect } from 'react-redux';
import { cancelAccess } from '../../redux/actions/userActions';
//MUI
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
// Icons
import UnsubscribeIcon from '@material-ui/icons/Unsubscribe';
import CancelIcon from '@material-ui/icons/Cancel';
//Components
import MyButton from '../../util/MyButton';
import renderSkeleton from '../../util/RowSkeleton';

function renderRow(props) {
  const { index, style, loading, errors, classes } = props;
  const data = props.data[index];

  const openTab = (link) => {
    if (!link.startsWith('http://') && !link.startsWith('https://')) window.open('http://' + link)
    else window.open(link)
  }

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
            <Link onClick={() => openTab(data.shortLink)} >
              {data.shortLink}
            </Link>
            {(data.type === 'requested') ? (<MyButton onClick={() => props.cancelAccess(data.subId)} tip="Cancel">
              <CancelIcon /></MyButton>) : (<MyButton onClick={() => props.cancelAccess(data.subId)} tip="Unsubscribe">
                <UnsubscribeIcon /></MyButton>)}
          </Typography>
        </Box>
        <Box
          component="div"
          my={0}
          textOverflow="ellipsis"
          overflow="hidden"
        >
          {data.authorHandle}
          {errors.error && (
            <Typography className={classes.customError} variant="body2" >
              {errors.error}
            </Typography>
          )}
        </Box>
      </div>
      {loading && (
        <CircularProgress className={classes.progress} size={30} />
      )}
    </ListItem>
  );
}
renderRow.propTypes = {
  classes: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  cancelAccess: PropTypes.func.isRequired,
  loading: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  errors: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),
};
function mapStateToPropsRow(state, ownProps) {
  return {
    loading: state.UI.loadingSubs[ownProps.data[ownProps.index].subId] || false,
    errors: state.UI.errorsSubs[ownProps.data[ownProps.index].subId] || false,
  }
}
const mapActionsToProps = {
  cancelAccess
};
const stylesRow = (theme) => ({
  customError: theme.forms.customError,
  ...theme.subsRow
});
const row = connect(
  mapStateToPropsRow,
  mapActionsToProps
)(withStyles(stylesRow)(renderRow));


const styles = (theme) => ({
  ...theme.list
});

function LinkList(props) {
  const { subs, classes, heading } = props;
  return (
    <div className={classes.root} >
      <Typography variant="h6" className={classes.heading}>{heading}</Typography>
      <FixedSizeList height={window.innerHeight - 360} width={'100%'}
        itemSize={150} itemData={subs.length ? subs : []}
        itemCount={subs.length ? subs.length : 3}  >

        {subs.length ? row : renderSkeleton}
        
      </FixedSizeList>
    </div>
  );
}
LinkList.propTypes = {
  classes: PropTypes.object.isRequired,
  subs: PropTypes.array.isRequired,
  heading: PropTypes.string.isRequired
};
const mapStateToProps = (state) => ({
  subs: state.user.subs
});
export default connect(mapStateToProps)(withStyles(styles)(LinkList));
