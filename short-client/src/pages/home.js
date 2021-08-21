//React
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//MUI
import Grid from '@material-ui/core/Grid';
//Components
import Shorts from '../components/short/LinkList';
import Subs from '../components/short/SubList';
import ShortForm from '../components/form/ShortForm';

class home extends Component {
  render() {
    const { authenticated } = this.props;
    return (
      <Grid container>
        {authenticated ? (
          <Fragment>
            <Grid item sm={12} xs={12}>
              <ShortForm />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Shorts heading='Shorts' />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Subs heading='Subs' />
            </Grid>
          </Fragment>
        ) : (
            <Grid item sm={12} xs={12}>
              <ShortForm />
            </Grid>
          )}
      </Grid>
    );
  }
}
home.propTypes = {
  authenticated: PropTypes.bool.isRequired
};
const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated
});
export default connect(mapStateToProps)(home);
