import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import Plant from '../models/plantInfo.model';
import { HttpClient } from '@angular/common/http';
import { map, single } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
    providedIn: 'root',
})
export class PlantsService {
    private http = inject(HttpClient);

    private readonly url: string = environment.useVps ? "https://msrsen.mooo.com" : "http://127.0.0.1:3000";
    plants: WritableSignal<Plant[]> = signal([]);
    constructor() {
        this.refresh();
    }
    refresh(): void {
        console.log("refreshing");
        this.http.get<Plant[]>(`${this.url}/plants`).pipe(
            map((plants) =>
                plants.map((p) => {
                    p.imagePath = this.url + p.imagePath;
                    if (p.lastWatered != undefined) {
                        p.lastWatered = new Date(p.lastWatered);
                    }
                    return p;
                })
            )).subscribe(plants => {
                console.log(plants);
                this.plants.set(plants);
            });

    }

    addPlant(name: string) {
        if (name === "") return;
        this.http.post(`${this.url}/plants`, { name: name }).subscribe(() => this.refresh());
    }

    renamePlant(newName: string, plantId: number) {
        this.http
            .patch(`${this.url}/plants/${plantId}`, { name: newName })
            .subscribe(() => this.refresh());
    }

    waterPlant(plantId: number, ISODate: string) {
        this.http.patch(`${this.url}/plants/${plantId}`, { lastWatered: ISODate }).subscribe(() => this.refresh());
    }

    deletePlant(plantId: number) {
        this.http.delete(`${this.url}/plants/${plantId}`).subscribe(() => this.refresh());
    }

    updatePlantImage(plantId: number, image: File) {
        const formData = new FormData();
        formData.append('image', image);
        this.http.post<Plant>(`${this.url}/plants/${plantId}/image`, formData)
            .subscribe(() => this.refresh());

    }
}
