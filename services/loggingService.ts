import { GasPayload } from '../types';

export const logToGoogleSheet = async (url: string, payload: GasPayload): Promise<boolean> => {
  try {
    // Using fetch with 'no-cors' mode is often necessary for Google Apps Script Web Apps
    // when called from a browser due to strict CORS policies on redirects.
    // However, 'no-cors' results in an opaque response, so we can't read the JSON result.
    // For this specific architecture, we use standard POST. 
    // The user MUST deploy the GAS script as "Me" (Execute as) and "Anyone" (Who has access).
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // GAS prefers text/plain to avoid preflight issues in some cases
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return result.status === 'success';
  } catch (error) {
    console.warn("Failed to log to Google Sheet:", error);
    // We don't want to break the app flow if logging fails
    return false;
  }
};