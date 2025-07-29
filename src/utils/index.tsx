export const htmlContent = (config: any) => `
    <html><head>
      <script src="https://cube.mervii.com/beta/cube.js"></script>
    </head><body>
      <script>
        const cubeConfig = ${JSON.stringify(config)};
        cubeConfig.onSuccess = tx => window.ReactNativeWebView.postMessage(JSON.stringify({type:'success', data: tx}));
        cubeConfig.onFailed  = tx => window.ReactNativeWebView.postMessage(JSON.stringify({type:'failed', data: tx}));
        cubeConfig.onCancel  = tx => window.ReactNativeWebView.postMessage(JSON.stringify({type:'cancel', data: tx}));
        cubeConfig.onError   = err => window.ReactNativeWebView.postMessage(JSON.stringify({type:'error', data: err}));
        // Initialize Cube
        CubeSDK.config(cubeConfig);
      </script>
    </body></html>
  `;
