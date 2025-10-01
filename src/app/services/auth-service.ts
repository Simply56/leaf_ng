import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly localSecretHostIp = 'https://192.168.0.195:8080/';
    private readonly storageKey = 'apiKey';
    private apiKey: string | null = null;
    async getApiKey(): Promise<string | null> {
        if (this.apiKey != null) return this.apiKey;

        const storedKey = localStorage.getItem(this.storageKey);
        if (storedKey) return (this.apiKey = storedKey);

        let key: string | null = null;

        // Only attempt fetch if allowed (non-mixed content)
        if (!window.isSecureContext) {
            try {
                const response = await fetch(this.localSecretHostIp);
                if (response.ok) {
                    key = await response.text();
                    localStorage.setItem(this.storageKey, key);
                }
            } catch (err) {
                console.log(err);
            }
        }

        if (!key) {
            key = prompt("Please enter the key");
            if (key) localStorage.setItem(this.storageKey, key);
        }

        this.apiKey = key;
        return key;
    }
}
