import { MESSAGES } from './constants/Messages';
import _ from 'lodash';

export const  validateForm = (name, value, field, preValidation, postValidation) => {
    if (!field) return { hasError: false, errorMsg: ''};

    if (preValidation) {
      const validationResult = preValidation(name, value, field);
      if (validationResult)
        return validationResult;
    }

    if (field.ismandatory === true && (!value || (_.isArray(value) && _.size(value) < 1)))
      return { hasError: true, errorMsg: (field.messages && field.messages.mandatory ? field.messages.mandatory : MESSAGES.MANDATORY) };

    if (value && field.minSize && field.minSize > value.length)
      return {
        hasError: true,
        errorMsg: (field.messages && field.messages.minSize ? field.messages.minSize : MESSAGES.MIN_SIZE.replace("#{value}", field.minSize))
      };
    if (value && field.maxSize && field.maxSize < value.length)
      return {
        hasError: true,
        errorMsg: (field.messages && field.messages.maxSize ? field.messages.maxSize : MESSAGES.MAX_SIZE.replace("#{value}", field.maxSize))
      };
    if (value && field.maxLength && field.maxLength < value.length)
      return {
        hasError: true,
        errorMsg: (field.messages && field.messages.maxLength ? field.messages.maxLength : MESSAGES.MAX_LENGTH.replace("#{value}", field.maxLength))
      };
    if (value && field.minLength && field.minLength > value.length)
      return {
        hasError: true,
        errorMsg: (field.messages && field.messages.minLength ? field.messages.minLength : MESSAGES.MIN_LENGTH.replace("#{value}", field.minLength))
      };

    if (value && field.regex && !field.regex.test(value))
      return { hasError: true, errorMsg: (field.messages && field.messages.regex ? field.messages.regex : MESSAGES.REG_EX) };

    if (postValidation) {
      const validationResult = postValidation(name, value, field);
      if (validationResult)
        return validationResult;
    }
    return { hasError: false, errorMsg: ''};

  }
