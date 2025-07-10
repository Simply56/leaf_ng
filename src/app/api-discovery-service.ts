import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApiDiscoveryService {
    private readonly expectedUUID: string = '73182a69-3fdf-4b5a-900a-e5369803afbb';
    private readonly port = 8080;


    async discoverBackend(): Promise<string | null> {
        const ips = Array.from({ length: 253 }, (_, i) => `192.168.0.${i + 1}`);
        const controllers = new Map<string, AbortController>();

        let resolveMatch: (ip: string | null) => void;
        const result = new Promise<string | null>(res => resolveMatch = res);

        for (const ip of ips) {
            const controller = new AbortController();
            controllers.set(ip, controller);

            fetch(`http://${ip}:${this.port}/ping`, {
                signal: controller.signal,
                mode: "cors"
            })
                .then(res => res.json())
                .then(json => {
                    if (json.uuid === this.expectedUUID) {
                        // Match found, cancel all others
                        for (const [otherIp, ctrl] of controllers) {
                            if (otherIp !== ip) ctrl.abort();
                        }
                        resolveMatch(ip);
                    }
                })
                .catch(() => {
                    // Ignored (could be network error, abort, etc.)
                });
        }

        // Add a timeout in case no match is found
        setTimeout(() => resolveMatch(null), 5000);

        return result;
    }
}
