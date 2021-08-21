import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
//React
import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList } from 'react-window';
//Redux
import { connect } from 'react-redux';
//MUI
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';
import withStyles from '@material-ui/core/styles/withStyles';
import Drawer from '@material-ui/core/Drawer';
// Icons
import PublicIcon from '@material-ui/icons/Public';
import LockIcon from '@material-ui/icons/Lock';
//Components
import MyButton from '../../util/MyButton';
import renderSkeleton from '../../util/RowSkeleton';
import LinkListDrawerLayout from '../layout/LinkListDrawerLayout';

function renderRow(props) {
  const { index, style, } = props;
  const data = props.data.data[index];
  dayjs.extend(relativeTime);
  return (
    <>
      <ListItem divider button style={style} key={index} onClick={() => props.data.openMenu(data)} >
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
          <Box component="div" my={1}
            overflow="auto">
            <Typography variant="h5" color="primary">
              {data.shortLink}
              {(data.private) ? (<MyButton tip="Private" >
                <LockIcon /></MyButton>) : (<MyButton tip="Public">
                  <PublicIcon /></MyButton>)}
            </Typography>
          </Box>
          <Box
            component="div"
            my={0}
            textOverflow="ellipsis"
            overflow="hidden"
          >
            {data.longLink}
          </Box>
        </div>
      </ListItem>
    </>
  );
}
renderRow.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
};


const styles = (theme) => ({
  ...theme.list, 
  drawerRoot: { width: 280, padding: 5 }
});

function LinkList(props) {
  const { links, classes, heading } = props;
  const [state, setState] = useState({
    right: false
  });

  const toggleDrawer = (anchor, open, ...rest) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open, data: rest });
  };

  const showMenu = (data) => {
    toggleDrawer('right', true, data)(new Event('open'));
  }

  const list = (data) => (
    <div className={classes.drawerRoot}
      role="presentation"
    >
      <LinkListDrawerLayout data={data} />
    </div>
  );
  return (
    <div className={classes.root} >
      <Typography variant="h6" className={classes.heading}>{heading}</Typography>

      <FixedSizeList height={window.innerHeight - 360} width={'100%'} itemSize={150}
        itemData={links.length ? { openMenu: showMenu, data: links } : []} 
        itemCount={links.length ? links.length : 3}  >

        {links.length ? renderRow : renderSkeleton}

      </FixedSizeList>
      
      <Drawer anchor={'right'} open={state['right']} onClose={toggleDrawer('right', false)} >
        {state['data'] && state['data'].length && (list(state['data']))}
      </Drawer>
    </div>
  );
}
LinkList.propTypes = {
  classes: PropTypes.object.isRequired,
  links: PropTypes.array.isRequired,
  heading: PropTypes.string.isRequired
};
const mapStateToProps = (state) => ({
  links: state.user.links
});
export default connect(mapStateToProps)(withStyles(styles)(LinkList));
