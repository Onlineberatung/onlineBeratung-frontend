# onlineBeratung-frontend

The frontend app for the Online Beratung.

Please refer to the [hosted documentation](https://onlineberatung.github.io/documentation/docs/setup/setup-frontend) for setup instructions.

## Development Setup

### Backend Proxy

The development server is configured with a reverse proxy that forwards all `/service/*` requests to a remote backend. By default, it uses:

```
https://familien.develop.onlineberatung.net
```

This means you can develop locally without needing to run the backend service. All API calls will be proxied to the remote development backend.

#### Customizing the Backend URL

To use a different backend, set the `VITE_API_URL` environment variable:

```bash
VITE_API_URL=https://your-backend.example.com npm run dev
```

Or create a `.env` file in the project root:

```
VITE_API_URL=https://your-backend.example.com
```

The proxy ensures that:

- All requests to `localhost:5173/service/*` are forwarded to the configured backend
- HTTPS is used with port 443 (standard)
- CORS headers are properly handled with `changeOrigin: true`
