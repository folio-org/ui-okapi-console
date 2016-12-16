/* eslint no-restricted-syntax: [0, "ForInStatement"] */
/* ^^^--- Not really what I want: I prefer to turn off JUST ForInStatement checking */

const isEmptyObject = (obj) => {
  for (const prop in obj)
    if (Object.prototype.toString.call(obj[prop]) !== '[object Undefined]')
      if (obj[prop] && obj[prop].length > 0) return false;
  return true;
};

export const removeEmpty = (data) => {
  for (const entry in data) {
    if (Object.prototype.toString.call(data[entry]) === '[object Array]') {
      if (data[entry].length) {
        let i = data[entry].length;
        while (i--) {
          if (Object.prototype.toString.call(data[entry][i]) === '[object Null]') {
            data[entry].splice(i, 1);
          } else if (isEmptyObject(data[entry][i])) {
            data[entry].splice(i, 1);
          } else if (Object.prototype.toString.call(data[entry][i]) === '[object Object]') {
            removeEmpty(data[entry][i]);
          }
        }
      }
    } else if (Object.prototype.toString.call(data[entry]) === '[object Object]') {
      removeEmpty(data[entry]);
    }
  }
};
