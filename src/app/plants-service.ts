import { inject, Injectable } from '@angular/core';
import plantInfo from './models/plantInfo.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { from, map, Observable, switchMap } from 'rxjs';
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

    urlPromise: Promise<string> = new Promise((resolve, reject) => {
        resolve("https://msrsen.duckdns.org")
    });
    allPlants$: Observable<plantInfo[]> = from(this.urlPromise).pipe(
        switchMap((url) =>
            this.http.get<plantInfo[]>(`${url}/plants`)
                .pipe(
                    map((plants) =>
                        plants.map((p) => {
                            p.imagePath = url + p.imagePath.slice(1);
                            if (p.lastWatered != undefined) {
                                p.lastWatered = new Date(p.lastWatered);
                            }
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

    renamePlant(newName: string, plant: plantInfo) {

        this.urlPromise.then(
            (url) => {
                this.http
                    .put(`${url}/plants/${plant.id}`, { name: newName })
                    .subscribe(_ => plant.name = newName);
            }
        );
    }

    waterPlant(plant: plantInfo, ISODate: string) {
        this.urlPromise.then(
            (url) => {
                this.http.put(`${url}/plants/${plant.id}/water`, { ISODate: ISODate }).subscribe(
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
        );
    }

    deletePlant(id: number) {
        this.urlPromise.then(
            (url) => {
                this.http.delete(`${url}/plants/${id}`).subscribe();
            }
        );
    }

    updatePlantImage(plant: plantInfo, image: File | undefined) {
        interface IResponse {
            message: string;
            newPath: string;
        }
        if (image == undefined) {
            console.log('image is undefined');
            return;
        }
        this.urlPromise.then((url) => {
            plant.imagePath = url;
            const formData = new FormData();
            formData.append('image', image);
            return this.http.put<IResponse>(`${url}/images/${plant.id}`, formData);
        }).then(resObs => {
            resObs.subscribe(res => {
                plant.imagePath += res.newPath.slice(1); // remove leading '.'
                console.log(plant.imagePath);
            });

        });
    }
}
