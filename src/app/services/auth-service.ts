import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly localSecretHostIp = 'http://192.168.0.195:8080/';
    private readonly storageKey = 'apiKey';
    constructor() {
    }
    async getApiKey(): Promise<string | null> {
        const storedKey = localStorage.getItem(this.storageKey);
        if (storedKey) {
            return storedKey;
        }
        const response = await fetch(this.localSecretHostIp);
        if (response.ok) {
            const key = await response.text();
            localStorage.setItem(this.storageKey, key);
            return key;
        }
        return null;
    }
}
