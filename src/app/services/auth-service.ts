import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly localSecretHostIp = 'http://192.168.0.195:8080/';
    private readonly storageKey = 'apiKey';
    private apiKey: string | null = null;
    constructor() {
    }
    async getApiKey(): Promise<string | null> {
        if (this.apiKey != null) {
            return this.apiKey;
        }
        const storedKey = localStorage.getItem(this.storageKey);
        if (storedKey) {
            this.apiKey = storedKey;
            return this.apiKey;
        }
        const response = await fetch(this.localSecretHostIp);
        if (response.ok) {
            const key = await response.text();
            localStorage.setItem(this.storageKey, key);
            this.apiKey = key;
            return this.apiKey;
        }
        return null;
    }
}
