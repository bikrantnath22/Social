import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';


const GoogleLoginButton = ({ onSuccess, onFailure }) => {
    return (
      <GoogleOAuthProvider clientId="133972205562-tbu7sqfgqvr5nq478ssfp4he0ar121mg.apps.googleusercontent.com">
        <div className="google-login-button">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={onFailure}
            
          />
        </div>
      </GoogleOAuthProvider>
    );
  };
  
  export default GoogleLoginButton;