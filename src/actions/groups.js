import { AsyncStorage } from 'react-native';

import { currentSignedUser } from './auth';

export const GROUP_ACTIVE_ID = '@Palpito:Group:ActiveId';

export const fetchGroups = async () => {
  let accessToken = await currentSignedUser();

  return fetch('http://palpito.com.br/grupos.json', {
    headers: { Authorization: `Bearer ${accessToken}` }
  }).then((response) => response.json())
  .catch((error) => {
    console.error('error: ', error);
  });
};

export const setActiveGroup = (groupId) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.setItem(GROUP_ACTIVE_ID, groupId.toString())
      .then(res => {
        if (res !== null) {
          resolve(res);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};


export const getActiveGroup = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(GROUP_ACTIVE_ID)
      .then(res => {
        if (res !== null) {
          resolve(res);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};
