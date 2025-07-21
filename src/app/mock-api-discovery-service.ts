import { Injectable } from '@angular/core';
import { environment } from './environments/environments';

@Injectable({
    providedIn: 'root'
})
export class MockApiDiscoveryService {

    async discoverBackend(): Promise<string | null> {
        if (environment.useVps) {
            return '152.67.64.149';
        }
        return 'localhost';
    }

}
