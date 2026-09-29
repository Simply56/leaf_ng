import { Injectable, signal, WritableSignal } from '@angular/core';
import Plant from '../models/plantInfo.model';
import { HttpClient } from '@angular/common/http';
import { defer, map, Observable, retry, timer } from 'rxjs';
import { environment } from '../environments/environments';
import { AuthService } from './auth-service';

@Injectable({
    providedIn: 'root',
})
export class PlantsService {
    loading = signal(true);
    plants: WritableSignal<Plant[]> = signal([]);
    error = signal<string | null>(null);

    private buildUrl(endpoint: string): string {
        return `${environment.url}${endpoint}?apiKey=${environment.apiKey}`;
    }

    constructor(
        private http: HttpClient,
        private auth: AuthService,
    ) {
        this.refresh();
    }

    async refresh(): Promise<void> {
        this.loading.set(true);
        const key = await this.auth.getApiKey();
        if (key) {
            environment.apiKey = key;
        }

        defer(() => this.http.get<Plant[]>(this.buildUrl('/plants')))
            .pipe(
                map((plants) =>
                    plants.map((p) => {
                        p.imagePath = environment.url + p.imagePath;
                        if (p.lastWatered != undefined) {
                            p.lastWatered = new Date(p.lastWatered);
                        }
                        return p;
                    }),
                ),
                retry({
                    count: 5,
                    delay: (error, retryCount) => {
                        console.error(
                            `Retry attempt ${retryCount} failed:`,
                            error,
                        );
                        return timer(1000); // wait 1s before retry
                    },
                }),
            )
            .subscribe({
                next: (plants) => {
                    this.plants.set(plants);
                    this.loading.set(false);
                    this.error.set(null);
                },
                error: (err) => {
                    console.error('Failed to fetch plants:', err);
                    this.loading.set(false);
                    this.error.set(
                        'Could not load plants. Check your connection and reload the page.',
                    );
                },
            });
    }

    addPlant(name: string) {
        if (name === '') return;
        this.mutate(
            this.http.post(this.buildUrl('/plants'), { name: name }),
            'Could not add the plant.',
        );
    }

    renamePlant(newName: string, plantId: number) {
        this.mutate(
            this.http.patch(this.buildUrl(`/plants/${plantId}`), {
                name: newName,
            }),
            'Could not rename the plant.',
        );
    }

    waterPlant(plantId: number, ISODate: string) {
        this.mutate(
            this.http.patch(this.buildUrl(`/plants/${plantId}`), {
                lastWatered: ISODate,
            }),
            'Could not log the watering.',
        );
    }

    deletePlant(plantId: number) {
        this.mutate(
            this.http.delete(this.buildUrl(`/plants/${plantId}`)),
            'Could not delete the plant.',
        );
    }

    updatePlantImage(plantId: number, image: File) {
        const formData = new FormData();
        formData.append('image', image);
        this.mutate(
            this.http.post<Plant>(
                this.buildUrl(`/plants/${plantId}/image`),
                formData,
            ),
            'Could not upload the image.',
        );
    }

    private mutate(request: Observable<unknown>, failureMessage: string) {
        request.subscribe({
            next: () => this.refresh(),
            error: (err) => {
                console.error(failureMessage, err);
                this.error.set(failureMessage);
            },
        });
    }
}
