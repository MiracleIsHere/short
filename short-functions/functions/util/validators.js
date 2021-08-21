const shortid = require('shortid');
const isEmail = (email) => {
  const regEx = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
};

exports.validateSignupData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = 'Must not be empty';
  } else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address';
  }
  if (data.password.length <= 6) errors.password = 'Password should be at least 7 characters';
  if (isEmpty(data.password)) errors.password = 'Must not be empty';
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = 'Passwords must match';
  if (isEmpty(data.handle)) errors.handle = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = 'Must not be empty';
  if (isEmpty(data.password)) errors.password = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLinkCode = (string) => {
  if (typeof string === "undefined") return true;
  else if (typeof string === "string") {
    if (string.length < 6) {
      const regEx = /^[a-zA-Z0-9_-]+$/; //    shortId
      return string.match(regEx)
    }

    return shortid.isValid(string);
  }
  else return false
};

exports.formHttpLink = (string) => {
  if (typeof string === "string" && string.trim().length !== 0) {
    if (!string.startsWith('http://') && !string.startsWith('https://')) return 'http://' + string
    else return string
  } else return ''
};