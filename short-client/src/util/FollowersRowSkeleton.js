//React
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
// MUI
import ListItem from '@material-ui/core/ListItem';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
  cardContent: {
    width: '100%',
    flexDirection: 'column',
    alignItems: "flex-start",
    padding: 25
  },
  handle: {
    width: 200,
    height: 28,
    backgroundColor: theme.palette.primary.main,
    marginTop: 20,
    marginBottom: 20
  },
  date: {
    height: 14,
    width: 100,
    backgroundColor: 'rgba(0,0,0, 0.3)',
  },
});

const RowSkeleton = (props) => {
  const { classes, index } = props;
  const content = (
    <ListItem divider button className={classes.cardContent} key={index} >
      <div className={classes.date} />
      <div className={classes.handle} />
    </ListItem>
  );
  return <Fragment>{content}</Fragment>;
};
RowSkeleton.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(RowSkeleton);
