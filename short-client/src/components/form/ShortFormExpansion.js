//React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
//MUI
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
// Redux stuff
import { connect } from 'react-redux';

const styles = (theme) => ({
  ...theme.expansion
});

class ShortFormExpansion extends Component {
  render() {
    const {
      errors, auth,
      linkCode, linkCodeChange,
      check, checkChange,
      classes
    } = this.props;
    return (
      <div className={classes.root}>
        <ExpansionPanel >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            id="panella-header"
          >
            <Typography className={classes.heading}>General settings</Typography>
            <Typography className={classes.secondaryHeading}>Only for users</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container>
              <Grid item xs={12} sm>
                <TextField
                  variant="outlined"
                  id="linkCode"
                  name="linkCode"
                  label="Your custom link code"
                  helperText={(auth) ? errors.linkCode : ''}
                  error={(auth) ? (errors.linkCode ? true : false) : false}
                  value={linkCode}
                  onChange={linkCodeChange}
                  fullWidth
                  disabled={!auth}
                />
                <FormControlLabel
                  control={<Checkbox checked={check} onChange={checkChange} name="check" />}
                  label="Private"
                  disabled={!auth}
                />
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}
ShortFormExpansion.propTypes = {
  classes: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  linkCodeChange: PropTypes.func.isRequired,
  linkCode: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.bool.isRequired,
  check: PropTypes.bool.isRequired,
  checkChange: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  UI: state.UI
});
export default connect(
  mapStateToProps
)(withStyles(styles)(ShortFormExpansion));
