import { Injectable, signal, WritableSignal } from '@angular/core';
import Plant from '../models/plantInfo.model';
import { HttpClient } from '@angular/common/http';
import { defer, map, retry, timer } from 'rxjs';
import { environment } from '../environments/environments';
import { AuthService } from './auth-service';

@Injectable({
    providedIn: 'root',
})
export class PlantsService {
    loading = signal(true);
    plants: WritableSignal<Plant[]> = signal([]);

    private buildUrl(endpoint: string): string {
        return `${environment.url}${endpoint}?apiKey=${environment.apiKey}`;
    }

    constructor(private http: HttpClient, private auth: AuthService) {
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
                    })
                ),
                retry({
                    delay: (error, retryCount) => {
                        console.error(
                            `Retry attempt ${retryCount} failed:`,
                            error
                        );
                        return timer(1000); // wait 1s before retry
                    },
                })
            )
            .subscribe({
                next: (plants) => {
                    this.plants.set(plants);
                    this.loading.set(false);
                },
                error: (err) => {
                    console.error('Failed to fetch plants:', err);
                    this.loading.set(false);
                },
            });
    }

    addPlant(name: string) {
        if (name === '') return;
        this.http
            .post(this.buildUrl('/plants'), { name: name })
            .subscribe(() => this.refresh());
    }

    renamePlant(newName: string, plantId: number) {
        this.http
            .patch(this.buildUrl(`/plants/${plantId}`), { name: newName })
            .subscribe(() => this.refresh());
    }

    waterPlant(plantId: number, ISODate: string) {
        this.http
            .patch(this.buildUrl(`/plants/${plantId}`), {
                lastWatered: ISODate,
            })
            .subscribe(() => this.refresh());
    }

    deletePlant(plantId: number) {
        this.http
            .delete(this.buildUrl(`/plants/${plantId}`))
            .subscribe(() => this.refresh());
    }

    updatePlantImage(plantId: number, image: File) {
        const formData = new FormData();
        formData.append('image', image);
        this.http
            .post<Plant>(this.buildUrl(`/plants/${plantId}/image`), formData)
            .subscribe(() => this.refresh());
    }
}
