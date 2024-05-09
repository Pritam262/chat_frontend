This is a [Realtime chat application](https://chat.protamjana.com) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install the dipendency:

```bash 
npn i
```
Create FirebaseConfig.ts file in utils folder and paste this code 

```bash
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: <YOUR API KEY>,
    authDomain: <YOUR AUTH DOMAIN>,
    projectId: <YOUR PROJECTID>,
    storageBucket: <YOUR STORAGE BUCKET ID>,
    messagingSenderId: <MESSAGING SENDER ID>,
    appId: <APP ID>,
    measurementId: <MEASUREMENT ID>
  };

  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const analytics = isSupported().then(() => getAnalytics(app));

export const firebaseAuth = getAuth(app);
```


then run development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.


