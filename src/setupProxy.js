const morgan = require('morgan');
const {
	createProxyMiddleware,
	responseInterceptor
} = require('http-proxy-middleware');
const express = require('express');
const path = require('path');

// Configuration
const API_PROXY_URL = (process.env.API_PROXY_URL ?? '')
	.replace('http://', '')
	.replace('https://', '');

module.exports = function (app) {
	app.use(morgan('dev'));

	app.use(
		'/releases',
		express.static(path.resolve('public', 'releases'), {
			fallthrough: false
		})
	);

	if (API_PROXY_URL) {
		app.use(
			['/auth', '/service', '/api', '/websocket'],
			createProxyMiddleware({
				target: `https://${API_PROXY_URL}`,
				xfwd: false,
				ws: true,
				cookieDomainRewrite: API_PROXY_URL,
				headers: {
					referer: `https://${API_PROXY_URL}`,
					origin: `https://${API_PROXY_URL}`
				},
				changeOrigin: true,
				selfHandleResponse: true, // res.end() will be called internally by responseInterceptor()
				onProxyReq: function (proxyReq, req, res) {
					proxyReq.removeHeader('x-forwarded-port');
					proxyReq.removeHeader('x-forwarded-host');
				},
				onProxyRes: responseInterceptor(
					async (responseBuffer, proxyRes, req, res) => {
						const allowOrigin = new URL(
							req.get('origin') || req.get('referer')
						).origin;
						res.removeHeader('access-control-allow-origin');
						res.setHeader(
							'access-control-allow-origin',
							allowOrigin
						);
						return responseBuffer;
					}
				)
			})
		);
	}
};
