export const useAuthProvider = () => {
  const loginAction = () => {
    const redirectUri = window.location.href;
    const state = btoa(redirectUri);

    window.location.href = `https://${import.meta.env.PUBLIC_AUTH0_DOMAIN}/authorize?response_type=code&client_id=${import.meta.env.PUBLIC_AUTH0_CLIENT_ID}&redirect_uri=${import.meta.env.PUBLIC_AUTH0_REDIRECT_URI}&state=${state}&scope=openid%20profile%20email%20offline_access`;
  }

  const logoutAction = () => {
    window.location.href = `https://${import.meta.env.PUBLIC_AUTH0_DOMAIN}/v2/logout?client_id=${import.meta.env.PUBLIC_AUTH0_CLIENT_ID}&returnTo=${import.meta.env.PUBLIC_AUTH0_LOGOUT_URI}`;
  }

  return {
    loginAction,
    logoutAction,
  };
};
