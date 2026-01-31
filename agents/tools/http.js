/**
 * HTTP Tools
 * HTTP client and header checking utilities
 */

export const httpTools = {
  client: {
    name: 'http:client',
    description: 'Make HTTP requests to local API',
    
    async execute(url, options = {}) {
      const baseUrl = options.baseUrl || 'http://localhost:5000';
      const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
      
      try {
        const response = await fetch(fullUrl, {
          method: options.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          body: options.body ? JSON.stringify(options.body) : undefined,
          signal: AbortSignal.timeout(options.timeout || 10000)
        });
        
        const contentType = response.headers.get('content-type');
        const isJson = contentType?.includes('application/json');
        
        return {
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: isJson ? await response.json() : await response.text()
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }
  },
  
  headers: {
    name: 'http:headers',
    description: 'Check security headers',
    
    async execute(url, options = {}) {
      const baseUrl = options.baseUrl || 'http://localhost:5000';
      const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
      
      const requiredHeaders = [
        'content-security-policy',
        'x-content-type-options',
        'x-frame-options',
        'strict-transport-security',
        'x-xss-protection'
      ];
      
      try {
        const response = await fetch(fullUrl, {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        });
        
        const headers = Object.fromEntries(response.headers.entries());
        const headerKeys = Object.keys(headers).map(k => k.toLowerCase());
        
        const present = requiredHeaders.filter(h => headerKeys.includes(h));
        const missing = requiredHeaders.filter(h => !headerKeys.includes(h));
        
        return {
          success: missing.length === 0,
          url: fullUrl,
          present,
          missing,
          headers,
          score: Math.round((present.length / requiredHeaders.length) * 100)
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }
  }
};
