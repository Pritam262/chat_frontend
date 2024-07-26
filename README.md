This is a [Realtime chat application](https://chat.pritamjana.com) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install the dipendency:

```bash 
npn i
```
Update next.config.js file with this code 

```bash
/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        apiKey: <GOOGLE API KEY>,
        authDomain: <YOUR APPLICATION AUTH DOMAIN>,
        projectId:<YOUR APPLICATION PROJECT ID>,
        storageBucket: <STORAGE BUCKET KEY>,
        messagingSenderId: <MESSAGE SENDER ID>,
        appId: <APP ID>,
        measurementId: <MEASUREMENT ID>
    },
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
        },
        {
            protocol: 'http',
            hostname: '192.168.50.14',
        },
        {
            protocol: 'http',
            hostname: 'localhost'
        }
        ]
    }
}

export default nextConfig;

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


