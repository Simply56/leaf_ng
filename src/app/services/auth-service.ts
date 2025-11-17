import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly storageKey = 'apiKey';
    private apiKey: string | null = null;
    async getApiKey(): Promise<string | null> {
        if (this.apiKey != null) return this.apiKey;

        const storedKey = localStorage.getItem(this.storageKey);
        if (storedKey) return (this.apiKey = storedKey);

        let key: string | null = null;

        if (!key) {
            key = prompt('Please enter the key');
            if (key) localStorage.setItem(this.storageKey, key);
        }

        this.apiKey = key;
        return key;
    }
}
