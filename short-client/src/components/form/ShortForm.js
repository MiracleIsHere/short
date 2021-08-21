//React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Redux stuff
import { connect } from 'react-redux';
import { postLink, postNAlink } from '../../redux/actions/dataActions';
//MUI
import withStyles from '@material-ui/core/styles/withStyles';
//Components
import ShortFormSumbit from './ShortFormSumbit';
import ShortFormExpansion from './ShortFormExpansion';

const styles = (theme) => ({
  ...theme.tab
});

class ShortForm extends Component {
  constructor() {
    super();
    this.state = {
      longLink: '',
      linkCode: '',
      check: false,
      shortened: false,
      errors: {}
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.UI.errors !== this.props.UI.errors) {
      if (this.props.UI.errors === null) this.setState({ errors: {} });
      else this.setState({ errors: this.props.UI.errors });
    }
    if (prevProps.short !== this.props.short) {
      this.setState({
        longLink: this.props.short,
        shortened: true
      })
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.props.authenticated) {
      const link = {
        longLink: this.state.longLink.trim(),
        private: this.state.check
      }
      if (this.state.linkCode.trim()) link.linkCode = this.state.linkCode.trim()
      this.props.postLink(link);
    }
    else this.props.postNAlink({ longLink: this.state.longLink.trim() });
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      shortened: false
    });
  };
  handleChangeCheckBox = (event) => {
    this.setState({
      [event.target.name]: event.target.checked,
      shortened: false
    });
  };
  render() {
    const { classes, authenticated } = this.props;
    return (
      <div className={classes.root}>
        <ShortFormSumbit
          handleOnSubmit={this.handleSubmit}
          longLink={this.state.longLink}
          longLinkChange={this.handleChange}
          shortened={this.state.shortened}
          errors={this.state.errors}>
          <ShortFormExpansion
            linkCode={this.state.linkCode}
            linkCodeChange={this.handleChange}
            check={this.state.check}
            checkChange={this.handleChangeCheckBox}
            errors={this.state.errors}
            auth={authenticated} />
        </ShortFormSumbit>
      </div>
    );
  }
}
ShortForm.propTypes = {
  classes: PropTypes.object.isRequired,
  postNAlink: PropTypes.func.isRequired,
  postLink: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  short: PropTypes.string.isRequired
};
const mapStateToProps = (state) => ({
  UI: state.UI,
  authenticated: state.user.authenticated,
  short: state.data.short
});
const mapActionsToProps = {
  postLink,
  postNAlink
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(ShortForm));
