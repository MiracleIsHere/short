//React
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// MUI Stuff
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import withStyles from '@material-ui/core/styles/withStyles';
//Components
import SignUp from '../components/auth/signup';
import Login from '../components/auth/login';

const styles = (theme) => ({
  ...theme.tab
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box >
          {children}
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function AuthTabs(props) {
  const pageParamIndex = window.location.href.lastIndexOf('/') + 1
  const tabName = window.location.href.slice(pageParamIndex)
  const classes = props.classes
  const [value, setValue] = useState(tabName);
  useEffect(() => {
    if (value !== tabName) setValue(tabName)
  }, [value, tabName]);
  const handleChange = (event, newValue) => {
    window.history.pushState(null, null, newValue)
    setValue(newValue);
  };
  return (
    <div className={classes.root}>
      <AppBar position="static" color='secondary'>
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs" variant="fullWidth">
          <Tab value='login' label="LOGIN" />
          <Tab value='signup' label="SIGN UP" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index='login'>
        <Login history={props.history} redirect={props.redirect} />
      </TabPanel>
      <TabPanel value={value} index='signup'>
        <SignUp history={props.history} redirect={props.redirect} />
      </TabPanel>
    </div>
  );
}
AuthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default (withStyles(styles)(AuthTabs));
