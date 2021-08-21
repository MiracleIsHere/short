//React
import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
//Redux
import { connect } from 'react-redux';
import { getLink, clearLink, requestAccess } from '../redux/actions/dataActions';
// MUI Stuff
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
//Icons
import AppIcon from '../images/tenor.gif';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import SendIcon from '@material-ui/icons/Send';
//Components
import MyButton from '../util/MyButton';

function LinkRedirect(props) {
  const [redirect, setRedirect] = useState('');
  const { classes, errors, link, loading, match, requestAccess, getLink, clearLink } = props;

  useEffect(() => {
    getLink(match.params[0])
  }, []);

  useEffect(() => {
    if (link) {
      setRedirect(link)
      if (!match.params[1]) window.location.replace(link);
      clearLink()
    }
  }, [link]);

  const redirectMarkup = ((redirect && match.params[1])) && (
    <Typography variant="body2" color="textSecondary">
      <Link onClick={() => window.location.replace(redirect)}>
        {redirect}
      </Link>
    </Typography>)

  const pictureMarkup = ((errors.exist || errors.error)) && (<>
    <img src={AppIcon} alt="Link does not exist!" />
    <Typography variant="body2" className={classes.customError}>
      {errors.exist}
      {errors.error}
    </Typography>
  </>)

  const authMarkup = (errors.auth) && (<>
    <MyButton tip="Login" onClick={() => props.history.push('/app/login')} >
      <MeetingRoomIcon />
    </MyButton>
    <Typography variant="body2">
      {errors.auth}
    </Typography></>)

  const privateMarkup = (errors.private) && (<>
    <MyButton tip="Request" onClick={() => requestAccess(match.params[0])}>
      <SendIcon />
    </MyButton>
    <Typography variant="body2" >
      {errors.private}
    </Typography></>)

  const requestMarkup = (errors.review || errors.errorOnRequest) && (<>
    <MyButton tip="Request again" onClick={() => requestAccess(match.params[0])}>
      <SendIcon />
    </MyButton>
    <Typography variant="body2">
      {errors.errorOnRequest}
      {errors.review}
    </Typography></>)

  const requestResponseMarkup = (errors.data) && (
    <Typography variant="body2">
      Requested!
    </Typography>)

  return (
    <div className={classes.root}>
      {!loading && (<>{redirectMarkup}
        {pictureMarkup}
        {authMarkup}
        {privateMarkup}
        {requestMarkup}
        {requestResponseMarkup}</>)}
      {loading && (<CircularProgress size={30} className={classes.progress} />)}
    </div>
  );
}
const styles = (theme) => ({
  ...theme.linkPage
});
LinkRedirect.propTypes = {
  classes: PropTypes.object.isRequired,
  link: PropTypes.string.isRequired,
};
const mapStateToProps = (state) => ({
  link: state.data.redirect,
  loading: state.UI.loadingLink,
  errors: state.UI.errorsLink
});
const mapActionsToProps = { getLink, clearLink, requestAccess };
export default connect(
  mapStateToProps,
  mapActionsToProps)(withStyles(styles)(LinkRedirect));
