import { Alert, AsyncStorage } from 'react-native';

export const USER_ACCESS_TOKEN = '@Palpito:User:AccessToken';

export const onSignIn = (email, password) => {
  return new Promise((resolve, reject) => {
    if (email.length > 1 && password.length > 1) {
      requestLogin(email, password)
        .then(response => {
          response.json().then(auth => {
            if (auth.access_token) {
              AsyncStorage.setItem(USER_ACCESS_TOKEN, auth.access_token);
              resolve(auth.access_token);
            } else {
              Alert.alert('Por favor, verifique o email e senha!');
            }
          })
        .catch(error => {
          Alert.alert('Ocorreu algum erro totalmente inesperado. E agora?!? Tenta daqui a pouco.');
        });
      });
    } else {
      Alert.alert('Por favor, preencha o email e a senha corretamente');
    }
  });
};

export const requestLogin = (email, password) => {
  const formData = new FormData();
  formData.append('username',   email);
  formData.append('password',   password);
  formData.append('grant_type', 'password');

  return fetch('http://www.palpito.com.br/oauth/token', { method: 'POST', body: formData });
}

export const onSignOut = () => AsyncStorage.removeItem(USER_ACCESS_TOKEN);

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
