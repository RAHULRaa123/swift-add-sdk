'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Ad402Config, Ad402ContextType, Ad402Error } from '../types';

const DEFAULT_API_BASE_URL = 'https://ad402.io';

// Create the context
const Ad402Context = createContext<Ad402ContextType | null>(null);

// Provider component
export const Ad402Provider: React.FC<{
config: Ad402Config;
children: React.ReactNode;
}> = ({ config, children }) => {
const [error, setError] = useState<Ad402Error | null>(null);

// Validate configuration
useEffect(() => {
if (!config.websiteId || config.websiteId.trim() === '') {
setError({
code: 'MISSING_WEBSITE_ID',
message: 'websiteId is required in Ad402Config'
});
return;
}

```
if (!config.walletAddress || config.walletAddress.trim() === '') {
  setError({
    code: 'MISSING_WALLET_ADDRESS',
    message: 'walletAddress is required in Ad402Config'
  });
  return;
}

if (!/^0x[a-fA-F0-9]{40}$/.test(config.walletAddress.trim())) {
  setError({
    code: 'INVALID_WALLET_ADDRESS',
    message: 'walletAddress must be a valid Ethereum address (0x...)'
  });
  return;
}

const apiBaseUrl = config.apiBaseUrl || DEFAULT_API_BASE_URL;

try {
  const parsedUrl = new URL(apiBaseUrl);

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    setError({
      code: 'INVALID_API_BASE_URL',
      message: 'apiBaseUrl must use http or https protocol'
    });
    return;
  }
} catch {
  setError({
    code: 'INVALID_API_BASE_URL',
    message: 'apiBaseUrl must be a valid URL'
  });
  return;
}

setError(null);
```

}, [config]);

// Default configuration values
const defaultConfig: Ad402Config = {
apiBaseUrl: DEFAULT_API_BASE_URL,
theme: {
primaryColor: '#000000',
backgroundColor: '#ffffff',
textColor: '#000000',
borderColor: '#e5e5e5',
fontFamily: 'JetBrains Mono, monospace',
borderRadius: 0
},
payment: {
networks: ['polygon'],
defaultNetwork: 'polygon',
recipientAddress: config.walletAddress
},
...config
};

const contextValue: Ad402ContextType = {
config: defaultConfig,
apiBaseUrl: defaultConfig.apiBaseUrl || DEFAULT_API_BASE_URL
};

if (error) {
return (
<div style={{
padding: '16px',
backgroundColor: '#fee',
border: '1px solid #fcc',
borderRadius: '4px',
fontFamily: 'monospace',
fontSize: '14px',
color: '#c00'
}}> <strong>Ad402 Configuration Error:</strong> {error.message} </div>
);
}

return (
<Ad402Context.Provider value={contextValue}>
{children}
</Ad402Context.Provider>
);
};

export const useAd402Context = (): Ad402ContextType => {
const context = useContext(Ad402Context);

if (!context) {
throw new Error('useAd402Context must be used within an Ad402Provider');
}

return context;
};

export const useAd402Config = (): Ad402Config => {
const { config } = useAd402Context();
return config;
};

export const useAd402Api = (): string => {
const { apiBaseUrl } = useAd402Context();
return apiBaseUrl;
};
