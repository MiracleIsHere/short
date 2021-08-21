//React
import React, { useEffect, useState, Fragment } from 'react';
//Redux
import { connect } from 'react-redux';
import { changeShortStatus, addSub, clearAddSub } from '../../redux/actions/userActions';
//MUI
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
//Components
import LinkSubList from '../short/LinkSubList';

const useStyles = makeStyles({
  progress: {
    left: 0,
    top: 0,
    right: 0,
    marginLeft: "auto",
    marginRight: "auto",
    margin: 'auto'
  },
  customError: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: 10
  },
  textField: {
    margin: '0px auto 10px auto'
  },
  button: {
    marginTop: 10,
    position: 'relative'
  },
  formRoot: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: '#eeeeee',
    padding: 10,
    borderRadius: "20px"
  }
});

function StatusLayout(props) {
  const { linkCode, privated, changeShortStatus, loading, errors } = props
  const [checked, setChecked] = useState(privated || false);
  const classes = useStyles()

  const handleChange = (event) => {
    changeShortStatus(linkCode, event.target.checked)
    setChecked(event.target.checked);
  };

  if (errors.hasOwnProperty('setBack') && errors.setBack !== checked) setChecked(!checked)

  return (
    <>
      {!loading && (<FormControlLabel
        control={<Checkbox disabled={loading} checked={checked} onChange={handleChange} name="check" />}
        label="Private"
      />)}
      <Box component="div"
        overflow="auto">
        {errors.errorOnChangePrivate && (
          <Typography variant="body2" className={classes.customError}>
            {errors.errorOnChangePrivate}
          </Typography>
        )}
      </Box>
      {loading && (<CircularProgress size={30} className={classes.progress} />)}
    </>
  );
}
function mapStateToPropsStatus(state, ownProps) {
  const shortLoading = state.UI.loadingShorts[ownProps.linkCode] || {}
  const isStatusLoading = shortLoading['status'] || false
  const shortError = state.UI.errorsShorts[ownProps.linkCode] || {}
  const isStatusError = shortError['status'] || false
  return {
    loading: isStatusLoading,
    errors: isStatusError,
  }
}
const mapActionsToPropsStatus = {
  changeShortStatus
};
const Status = connect(
  mapStateToPropsStatus,
  mapActionsToPropsStatus
)(StatusLayout);

function AddSubLayout(props) {
  const { linkCode, addSub, clearAddSub, loading, errors } = props
  const classes = useStyles()
  const [value, setValue] = useState((loading.load && loading.back) ||
    (errors.errorOnGrant && errors.back) ||
    ''
  );
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  useEffect(() => {
    if (errors.granted) {
      setValue('')
      clearAddSub(linkCode)
    }
  }, [errors]);
  return (
    <div className={classes.formRoot} >
      <TextField
        id="handle"
        label="Handle"
        className={classes.textField}
        helperText={errors.errorOnGrant}
        error={errors.errorOnGrant ? true : false}
        value={value}
        onChange={handleChange}
        fullWidth
      />
      <Button
        type="submit"
        variant="contained"
        color="secondary"
        className={classes.button}
        disabled={loading.load}
        onClick={() => addSub(linkCode, value)}
        fullWidth
      >
        {!loading.load && "Grant"}
        {loading.load && (
          <CircularProgress size={30} className={classes.progress} />
        )}
      </Button>
    </div>
  );
}
function mapStateToPropsAdd(state, ownProps) {
  const addSubLoading = state.UI.loadingAddSub[ownProps.linkCode] || {}
  const addSubError = state.UI.errorsAddSub[ownProps.linkCode] || {}
  return {
    loading: addSubLoading,
    errors: addSubError,
  }
}
const mapActionsToPropsAdd = {
  addSub,
  clearAddSub
};
const AddSub = connect(
  mapStateToPropsAdd,
  mapActionsToPropsAdd
)(AddSubLayout);

export default function LinkListDrawerLayout(props) {
  const { data } = props
  const link = data[0]

  const openTab = (link) => {
    if (!link.startsWith('http://') && !link.startsWith('https://')) window.open('http://' + link)
    else window.open(link)
  }

  return (
    <div style={{ width: '100%', whiteSpace: 'nowrap', textAlign: 'center' }}>
      <Box component="div" my={1}
        overflow="auto">
        <Typography variant="h6" color="primary">
          <Link onClick={() => openTab(link.shortLink)} >
            {link.shortLink}
          </Link>
        </Typography>
      </Box>
      <Box component="div" my={1}
        overflow="auto">
        <Typography >
          <Link onClick={() => openTab(link.longLink)} color='inherit' >
            {link.longLink}
          </Link>
        </Typography>
      </Box>
      <Status linkCode={link.linkCode} privated={link.private} />
      <AddSub linkCode={link.linkCode} />
      <LinkSubList heading='Followers' linkCode={link.linkCode} />
    </div>
  );
}