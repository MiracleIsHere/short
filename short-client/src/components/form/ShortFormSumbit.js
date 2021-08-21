//React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// MUI Stuff
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
// Redux stuff
import { connect } from 'react-redux';

const styles = (theme) => ({
  ...theme.forms
});

class ShortFormSumbit extends Component {
  render() {
    const { children, handleOnSubmit,
      longLink, longLinkChange,
      shortened, errors,
      classes,
      UI: { loading }
    } = this.props;
    return (
      <Grid container className={classes.form}>
        <Grid item xs={12} sm>
          <form noValidate onSubmit={handleOnSubmit}>
            <TextField
              variant="outlined"
              id="longLink"
              name="longLink"
              label="Shorten your link"
              style={{ backgroundColor: '#ffffff' }}
              className={classes.textField}
              helperText={errors.longLink}
              error={errors.longLink ? true : false}
              value={longLink}
              onChange={longLinkChange}
              fullWidth
            />
            {errors.general && (
              <Typography variant="body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            {children}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading || shortened}
              fullWidth
            >
              {shortened ? 'Done' : 'Shorten'}
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
          </form>
        </Grid>
      </Grid>
    );
  }
}
ShortFormSumbit.propTypes = {
  classes: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  longLinkChange: PropTypes.func.isRequired,
  longLink: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired,
  shortened: PropTypes.bool.isRequired,
};
const mapStateToProps = (state) => ({
  UI: state.UI,
});
export default connect(
  mapStateToProps
)(withStyles(styles)(ShortFormSumbit));
