import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MockApiDiscoveryService {

    async discoverBackend(): Promise<string | null> {
        return '127.0.0.1'; // or 'localhost'
    }

}
