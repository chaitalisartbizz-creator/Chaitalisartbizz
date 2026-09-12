// Robust URL parameter encoding that selectively compresses Unicode (Hindi/Marathi) 
// into base64url to prevent massive %E0%A4%... bloat in copied URLs.

const b64EncodeUnicode = (str) => {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
          return String.fromCharCode('0x' + p1);
  })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const b64DecodeUnicode = (str) => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
};

export function encodeUrlParam(str) {
  if (!str || str === 'All') return str;
  // If string is purely ASCII, leave it as is (browser handles spaces as + or %20)
  if (/^[\x00-\x7F]*$/.test(str)) return str;
  // If it has non-ASCII (Unicode), compress it and prefix with _
  return '_' + b64EncodeUnicode(str);
}

export function decodeUrlParam(str) {
  if (!str || str === 'All') return str;
  if (str.startsWith('_')) {
    try { return b64DecodeUnicode(str.slice(1)); } catch(e) { return str; }
  }
  return str;
}
