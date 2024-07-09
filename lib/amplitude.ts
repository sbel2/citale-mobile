import { init as amplitudeInit } from '@amplitude/analytics-browser';

export const initAmplitude = () => {
  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
  if (apiKey) {
    amplitudeInit(apiKey);
  } else {
    console.warn('Amplitude API key');
  }
};