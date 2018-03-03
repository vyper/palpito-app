import { AsyncStorage } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import Config from 'react-native-config';
import { Toast } from 'native-base';

import { delActiveGroup } from './groups';

export const USER_ACCESS_TOKEN = '@Palpito:User:AccessToken';

export const onFacebookSignIn = async () => {
  try {
    const result = await LoginManager.logInWithReadPermissions(['public_profile']);
    if (result.isCancelled) throw 'Cancelado.';

    const data = await AccessToken.getCurrentAccessToken();
    const response = await requestFacebookSignInSignUp(data.accessToken, data.userID);
    const auth = await response.json();
    await AsyncStorage.setItem(USER_ACCESS_TOKEN, auth.access_token);

    return true;
  } catch (err) {
    Toast.show({
      text: err,
      buttonText: 'Ok',
      type: 'danger',
      duration: 5000,
    });

    return false;
  }
};

export const onSignIn = async (email, password) => {
  try {
    const response = await requestLogin(email, password);

    if (email.length < 1 || password.length < 1) throw 'É obrigatório preencher email e senha!';
    if (response.status == 401) throw 'É necessário preencher email e senha corretamente!';
    if (response.status != 200) throw 'Ocorreu algum erro totalmente inesperado. E agora?!? Tenta daqui a pouco.';

    const auth = await response.json();
    await AsyncStorage.setItem(USER_ACCESS_TOKEN, auth.access_token);

    return true;
  } catch (error) {
    Toast.show({
      text: error,
      buttonText: 'Ok',
      type: 'danger',
      duration: 5000,
    });

    return false;
  }
};

export const requestLogin = (email, password) => {
  const headers = { 'Content-Type': 'application/json' };
  const body = JSON.stringify({ username: email, password: password, grant_type: 'password' });

  return fetch('http://www.palpito.com.br/oauth/token', { method: 'POST', headers, body });
};

export const requestFacebookSignInSignUp = (accessToken, uid) => {
  const headers = { 'Content-Type': 'application/json' };
  const body = JSON.stringify({
    uid: uid,
    access_token: accessToken,
    client_id: Config.PALPITO_APPLICATION_CLIENT,
    client_secret: Config.PALPITO_APPLICATION_SECRET,
    grant_type: 'client_credentials',
  });

  return fetch('http://www.palpito.com.br/entrar/facebook', { method: 'POST', headers, body });
};

export const onSignOut = async () => {
  await AsyncStorage.removeItem(USER_ACCESS_TOKEN);
  await delActiveGroup();

  const data = await AccessToken.getCurrentAccessToken();
  if (data) LoginManager.logOut();
}

export const currentSignedUser = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(USER_ACCESS_TOKEN)
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
