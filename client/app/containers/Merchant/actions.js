/*
 *
 * Merchant actions
 *
 */

import { push } from 'connected-react-router';
import { success } from 'react-notification-system-redux';
import axios from 'axios';

import {
  FETCH_MERCHANTS,
  REMOVE_MERCHANT,
  SELL_FORM_CHANGE,
  SET_SELL_FORM_ERRORS,
  SELL_FORM_RESET,
  SIGNUP_CHANGE,
  SET_SIGNUP_FORM_ERRORS,
  SET_MERCHANTS_LOADING,
  SET_SELL_SUBMITTING,
  SET_SELL_LOADING,
  SIGNUP_RESET
} from './constants';

import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { signOut } from '../Login/actions';

export const sellFormChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: SELL_FORM_CHANGE,
    payload: formData
  };
};

export const merchantSignupChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: SIGNUP_CHANGE,
    payload: formData
  };
};

export const sellWithUs = () => {
  return async (dispatch, getState) => {
    try {
      const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

      const rules = {
        name: 'required',
        email: 'required|email',
        phoneNumber: ['required', `regex:${phoneno}`],
        brand: 'required',
        business: 'required|min:10'
      };

      const merchant = getState().merchant.sellFormData;

      const { isValid, errors } = allFieldsValidation(merchant, rules, {
        'required.name': 'Name is required.',
        'required.email': 'Email is required.',
        'email.email': 'Email format is invalid.',
        'required.phoneNumber': 'Phone number is required.',
        'regex.phoneNumber': 'Phone number format is invalid.',
        'required.brand': 'Brand is required.',
        'required.business': 'Business is required.',
        'min.business': 'Business must be at least 10 characters.'
      });

      if (!isValid) {
        return dispatch({ type: SET_SELL_FORM_ERRORS, payload: errors });
      }

      dispatch({ type: SET_SELL_SUBMITTING, payload: true });
      dispatch({ type: SET_SELL_LOADING, payload: true });

      const response = await axios.post(
        '/api/merchant/seller-request',
        merchant
      );

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      dispatch({ type: SELL_FORM_RESET });
      dispatch(success(successfulOptions));
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch({ type: SET_SELL_SUBMITTING, payload: false });
      dispatch({ type: SET_SELL_LOADING, payload: false });
    }
  };
};

export const fetchMerchants = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: SET_MERCHANTS_LOADING, payload: true });

      const response = await axios.get(`/api/merchant/list`);

      dispatch({
        type: FETCH_MERCHANTS,
        payload: response.data.merchants
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch({ type: SET_MERCHANTS_LOADING, payload: false });
    }
  };
};

export const approveMerchant = merchant => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.put(`/api/merchant/approve/${merchant._id}`);

      dispatch(fetchMerchants());
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const rejectMerchant = merchant => {
  return async (dispatch, getState) => {
    try {
      await axios.put(`/api/merchant/reject/${merchant._id}`);

      dispatch(fetchMerchants());
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const merchantSignUp = token => {
  return async (dispatch, getState) => {
    try {
      const rules = {
        email: 'required|email',
        password: 'required|min:6',
        firstName: 'required',
        lastName: 'required'
      };

      const merchant = getState().merchant.signupFormData;

      const { isValid, errors } = allFieldsValidation(merchant, rules, {
        'required.email': 'Email is required.',
        'required.password': 'Password is required.',
        'required.firstName': 'First Name is required.',
        'required.lastName': 'Last Name is required.'
      });

      if (!isValid) {
        return dispatch({ type: SET_SIGNUP_FORM_ERRORS, payload: errors });
      }

      await axios.post(`/api/merchant/signup/${token}`, merchant);

      const successfulOptions = {
        title: `You have signed up successfully! Please sign in with the email and password. Thank you!`,
        position: 'tr',
        autoDismiss: 1
      };

      dispatch(signOut());
      dispatch(success(successfulOptions));
      dispatch(push('/login'));
      dispatch({ type: SIGNUP_RESET });
    } catch (error) {
      const title = `Please try to signup again!`;
      handleError(error, dispatch, title);
    }
  };
};

// delete merchant api
export const deleteMerchant = id => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.delete(`/api/merchant/delete/${id}`);

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success == true) {
        dispatch(success(successfulOptions));
        dispatch({
          type: REMOVE_MERCHANT,
          payload: id
        });
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};
