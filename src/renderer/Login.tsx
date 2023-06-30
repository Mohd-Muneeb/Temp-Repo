import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './configs';

function Login() {
  // const provider = new GoogleAuthProvider();

  const [Password, setPassword] = useState('');
  const [Email, setEmail] = useState('');

  const onSignIn = () => {
    signInWithEmailAndPassword(auth, Email, Password)
      .then(() => {
        // Signed in
        console.log('Logged in');
        // ...
        return null;
      })
      .catch(() => {
        console.log('error occured');
      });
  };

  const [, loading] = useAuthState(auth);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex w-full h-screen flex-col items-center justify-center">
      <div>
        <h1 className="my-2 text-4xl font-bold">Sign In</h1>
        <h3>Sign in to your account</h3>

        <div className="my-4 flex gap-4">
          <button
            type="button"
            onClick={() => onSignIn()}
            className="group flex h-8 items-center justify-center gap-2 rounded-[10px] bg-[#FFFFFF] p-2 text-sm"
          >
            <img
              alt=""
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              className="h-4"
            />
            <p className=" opacity-50 group-hover:opacity-100">
              Sign in with Google
            </p>
          </button>

          <button
            type="button"
            className="group flex h-8 items-center justify-center gap-2 rounded-[10px] bg-[#FFFFFF] p-2 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="14"
              viewBox="0 0 12 14"
              fill="none"
            >
              <path
                d="M6.34516 1.21952C7.27201 0.00716167 8.56055 0.00125122 8.56055 0.00125122C8.56055 0.00125122 8.75222 1.14107 7.83144 2.23908C6.84828 3.41151 5.73078 3.21966 5.73078 3.21966C5.73078 3.21966 5.52094 2.29759 6.34516 1.21952ZM5.84866 4.0181C6.32548 4.0181 7.21043 3.36763 8.36232 3.36763C10.3451 3.36763 11.1251 4.76781 11.1251 4.76781C11.1251 4.76781 9.59954 5.54189 9.59954 7.42017C9.59954 9.53904 11.5 10.2693 11.5 10.2693C11.5 10.2693 10.1715 13.9801 8.37708 13.9801C7.55292 13.9801 6.91217 13.4289 6.04378 13.4289C5.15883 13.4289 4.28065 14.0007 3.70868 14.0007C2.0701 14.0007 0 10.4806 0 7.65098C0 4.86704 1.7522 3.40664 3.39569 3.40664C4.46411 3.40664 5.29321 4.0181 5.84866 4.0181Z"
                fill="#999999"
              />
            </svg>
            <p className=" opacity-50 group-hover:opacity-100">
              Sign in with Apple
            </p>
          </button>
        </div>
        <div className="my-4 rounded-md bg-white p-4">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="font-normal">Email address</h1>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-[10px] bg-base p-2"
                placeholder="Email"
              />
            </div>
            <div>
              <h1 className="font-normal">Password</h1>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="mt-1 w-full rounded-[10px] bg-base p-2 "
                placeholder="Password"
              />
            </div>

            <a href="/" className="text-[#346BD4] hover:underline">
              Forgot password?
            </a>
            <button
              type="button"
              onClick={() => onSignIn()}
              className="rounded-[10px] bg-black p-2 text-white "
            >
              Sign In
            </button>
          </div>
        </div>
        <h1 className="mt-4 text-center opacity-100">
          <span className="opacity-60">Don`t have an account? </span>
          <a href="/" className="text-[#346BD4] opacity-100 hover:underline">
            Register here
          </a>
        </h1>
      </div>
    </div>
  );
}

export default Login;
