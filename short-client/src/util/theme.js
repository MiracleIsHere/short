export default {
  palette: {
    primary: {
      light: '#33c9dc',
      main: '#00bcd4',
      dark: '#008394',
      contrastText: '#fff'
    },
    secondary: {
      light: '#ff6333',
      main: '#ff3d00',
      dark: '#b22a00',
      contrastText: '#fff'
    }
  },
  subsRow: {
    root: {
      width: '100%', whiteSpace: 'nowrap'
    },
    progress: {
      position: 'absolute',
      left: 0,
      right: 0,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  linkItem: {
    root: {
      width: '100%', whiteSpace: 'nowrap'
    },
    icon: {
      position: "relative", width: '1px', height: '1px',
    },
  },
  list: {
    root: {
      backgroundColor: '#ffffff',
      paddingBottom: 20,
      borderRadius: "25px",
      margin: '10px 5px 10px 5px',
      border: '1px solid rgba(0,0,0,0.1)',
    },
    heading: {
      flexShrink: 0,
      textAlign: 'center'
    },
  },
  tab: {
    root: {
      backgroundColor: '#ffffff',
      paddingBottom: 20,
      borderRadius: "25px"
    },
  },
  expansion: {
    root: {
      width: '100%',
    },
    heading: {
      fontSize: 15,
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: 15,
      color: '#00bcd4',
      flexBasis: '33.33%',
    },
  },
  forms: {
    typography: {
      useNextVariants: true
    },
    form: {
      textAlign: 'center'
    },

    pageTitle: {
      margin: '0px auto 10px auto'
    },
    textField: {
      margin: '0px auto 10px auto'
    },
    button: {
      marginTop: 10,
      position: 'relative'
    },
    customError: {
      color: 'red',
      fontSize: '0.8rem',
      marginTop: 10
    },
    progress: {
      position: 'absolute'
    },
    invisibleSeparator: {
      border: 'none',
      margin: 4
    },
    visibleSeparator: {
      width: '100%',
      borderBottom: '1px solid rgba(0,0,0,0.1)',
      marginBottom: 10
    },
    paper: {
      padding: 10
    }
  },
  linkPage: {
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "80vh"
    },
    typography: {
      useNextVariants: true,
    },
    customError: {
      color: 'red',
      fontSize: '0.8rem',
      marginTop: 10,
    },
    progress: {
      // position: 'absolute',
      top: '50%',
    }
  },
  listSub: {
    root: {
      backgroundColor: '#ffffff',
      paddingBottom: 20,
      borderRadius: "25px",
      margin: '10px 0px 0px 0px',
      border: '1px solid rgba(0,0,0,0.1)',
    },
    heading: {
      flexShrink: 0,
      textAlign: 'center'
    },
    customError: {
      color: 'red',
      fontSize: '0.8rem',

    },
  },
  buttons: {
    textAlign: 'center',
    '& a': {
      margin: '10px 10px'
    }
  },
  ctrlBtn: {
    position: 'absolute',
    right: 0,
    display: "flex",
    flexDirection: "column",
  },
};
