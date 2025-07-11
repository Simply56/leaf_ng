import { inject, Injectable } from '@angular/core';
import plantInfo from './models/plantInfo.model';
import { HttpClient } from '@angular/common/http';
import { from, map, switchMap } from 'rxjs';
import { ApiDiscoveryService } from './api-discovery-service';

@Injectable({
    providedIn: 'root',
})
export class PlantsService {
    private http = inject(HttpClient);
    private discovery: ApiDiscoveryService = inject(ApiDiscoveryService);

    urlPromise: Promise<string> = new Promise((resolve, reject) => {
        this.discovery.discoverBackend().then(ip => {
            if (ip != null) {
                resolve(`http://${ip}:8080`);
            };
            reject();
        });
    });

    allPlants$ = from(this.urlPromise).pipe(
        switchMap((url) =>
            this.http.get<plantInfo[]>(`${url}/plants`)
                .pipe(
                    map((plants) =>
                        plants.map((p) => {
                            console.log(url);
                            p.imagePath = url + p.imagePath.slice(1);
                            console.log(p.imagePath);
                            return p;
                        })
                    )
                )
        )
    );

    getPlantById(id: number) {
        return this.allPlants$.pipe(
            map((plants) => plants.find((p) => p.id == id))
        );
    }

    addPlant(name: string) {
        this.urlPromise.then(
            (url) => {
                this.http.post(`${url}/plants`, { name: name }).subscribe();
            }
        );
    }

    renamePlant(newName: string, id: number) {

        this.urlPromise.then(
            (url) => {
                this.http
                    .put(`${url}/plants/${id}`, { name: newName })
                    .subscribe();
            }
        );
    }

    waterPlant(id: number) {
        this.urlPromise.then(
            (url) => {
                this.http.put(`${url}/plants/${id}/water`, {}).subscribe();
            }
        );
    }

    deletePlant(id: number) {

        this.urlPromise.then(
            (url) => {
                this.http.delete(`${url}/plants/${id}`).subscribe();
            }
        );
    }

    updatePlantImage(id: number, image: File | undefined) {
        if (image == undefined) {
            console.log('image is undefined');
            return;
        }

        return from(this.urlPromise).pipe(switchMap((url) => {
            const formData = new FormData();
            formData.append('image', image);
            return this.http.put(`${url}/images/${id}`, formData);
        }));
    }
}
