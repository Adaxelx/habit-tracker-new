import en from './en';
import pl from './pl';

export default {
  'pl-PL': pl,
  'en-EN': en,
};

export enum locale {
  PL = 'pl-PL',
  EN = 'en-EN',
}

// https://github.com/yahoo/react-intl/wiki/Upgrade-Guide#flatten-messages-object
export function flattenMessages(nestedMessages: any, prefix = '') {
  return Object.keys(nestedMessages).reduce((messages: any, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      // eslint-disable-next-line no-param-reassign
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
}
