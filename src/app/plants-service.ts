import { inject, Injectable } from '@angular/core';
import Plant from './models/plantInfo.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from './environments/environments';

@Injectable({
    providedIn: 'root',
})
export class PlantsService {
    private http = inject(HttpClient);


    url: string = environment.useVps ? "https://msrsen.mooo.com" : "http://127.0.0.1:3000";
    allPlants$: Observable<Plant[]> = this.http.get<Plant[]>(`${this.url}/plants`).pipe(
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
        if (name === "") return;
        this.http.post(`${this.url}/plants`, { name: name }).subscribe();
    }

    renamePlant(newName: string, plant: Plant) {
        this.http
            .put(`${this.url}/plants/${plant.id}`, { name: newName })
            .subscribe(() => plant.name = newName);
    }

    waterPlant(plant: Plant, ISODate: string) {
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

    updatePlantImage(plant: Plant, image: File) {

        const formData = new FormData();
        formData.append('image', image);
        this.http.post<Plant>(`${this.url}/plants/${plant.id}/image`, formData)
            .subscribe(res => {
                plant.imagePath = this.url + res.imagePath;
            });

    }
}
