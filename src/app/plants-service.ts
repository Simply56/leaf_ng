import { inject, Injectable } from '@angular/core';
import plantInfo from './models/plantInfo.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiDiscoveryService } from './api-discovery-service';

@Injectable({
    providedIn: 'root',
})
export class PlantsService {
    private http = inject(HttpClient);
    private discovery: ApiDiscoveryService = inject(ApiDiscoveryService);
    private port = 5000;

    // TODO: resolve this
    // urlPromise: Promise<string> = new Promise((resolve, reject) => {
    //     this.discovery.discoverBackend().then(ip => {
    //         if (ip != null) {
    //             resolve(`https://${ip}:${this.port}`);
    //         };
    //         reject();
    //     });
    // });

    url: string = "http://127.0.0.1:3000";
    allPlants$: Observable<plantInfo[]> = this.http.get<plantInfo[]>(`${this.url}/plants`).pipe(
        map((plants) =>
            plants.map((p) => {
                p.imagePath = this.url + p.imagePath;
                if (p.lastWatered != undefined) {
                    p.lastWatered = new Date(p.lastWatered);
                }
                return p;
            })
        )
    );
    getPlantById(id: number) {
        return this.allPlants$.pipe(
            map((plants) => plants.find((p) => p.id == id))
        );
    }

    addPlant(name: string) {
        this.http.post(`${this.url}/plants`, { name: name }).subscribe();
    }

    renamePlant(newName: string, plant: plantInfo) {
        this.http
            .put(`${this.url}/plants/${plant.id}`, { name: newName })
            .subscribe(() => plant.name = newName);
    }

    waterPlant(plant: plantInfo, ISODate: string) {
        this.http.patch(`${this.url}/plants/${plant.id}/water`, { wateredAt: ISODate }).subscribe(
            {
                next: (res) => {
                    plant.lastWatered = new Date(ISODate);
                },
                error: (err) => {
                    if (err.status == 404) { console.log("plant" + plant.id + " not found"); }
                }
            }
        );
    }

    deletePlant(id: number) {
        this.http.delete(`${this.url}/plants/${id}`).subscribe();
    }

    updatePlantImage(plant: plantInfo, image: File) {

        const formData = new FormData();
        formData.append('image', image);
        this.http.post<plantInfo>(`${this.url}/plants/${plant.id}/image`, formData)
            .subscribe(res => {
                plant.imagePath = this.url + res.imagePath;
            });

    }
}
