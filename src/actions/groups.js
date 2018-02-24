import { currentSignedUser } from './auth';

export const fetchGroups = async () => {
  let accessToken = await currentSignedUser;

  return fetch('http://palpito.com.br/grupos.json', {
    headers: { Authorization: `Bearer ${accessToken}` }
  }).then((response) => response.json())
  .catch((error) => {
    console.error('error: ', error);
  });
};
