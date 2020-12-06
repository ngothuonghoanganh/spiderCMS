import { get, isEmpty } from 'lodash';
/** Set Local Store Data
 *Input: String;
 *Output: none
 *Store Data In Local
 */
export default function handleLocalStore(data) {
  if (!isEmpty(data)) {
    window.localStorage.setItem('localStore', JSON.stringify(data));
  }
}

/** Get Local Data
 *Input: none;
 *Output: Obj;
 *Get Data In Local
 */
export function getLocalStore() {
  return JSON.parse(window.localStorage.getItem('localStore'));
}


/** Get One Item In Local Data
 *Input: key: String;
 *Output: data: any;
 *Get One Data In Local
 */
export function getItemLocalStore(key) {
  const localStore = JSON.parse(window.localStorage.getItem('localStore'));
  return get(localStore, key, null);
}

/** Delete Local Data
 *Input: none;
 *Output: Obj;
 *Delete Data In Local
 */
export function deleteLocalStore() {
  window.localStorage.removeItem('localStore');
}
