import { Injectable } from '@angular/core';

declare global {
  interface Window {
    env: {
      HONEYCOMB_API_KEY: string;
      API_URL: string;
      CHAT_ENDPOINT: string;
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  get honeycombApiKey(): string {
    return window.env.HONEYCOMB_API_KEY;
  }

  get apiUrl(): string {
    return window.env.API_URL;
  }

  get chatEndpoint(): string {
    return window.env.CHAT_ENDPOINT;
  }
} 