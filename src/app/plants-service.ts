import { computed, inject, Injectable, Signal } from '@angular/core';
import plantInfo from './models/plantInfo.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PlantsService {
    private http = inject(HttpClient);

    url = 'http://localhost:8080';

    allPlants$ = this.http.get<plantInfo[]>(`${this.url}/plants`).pipe(
        map((plants) =>
            plants.map((p) => {
                p.imagePath = this.url + p.imagePath.slice(1);
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

    renamePlant(newName: string, id: number) {
        this.http
            .put(`${this.url}/plants/${id}`, { name: newName })
            .subscribe();
    }

    waterPlant(id: number) {
        this.http.put(`${this.url}/plants/${id}/water`, {}).subscribe();
    }

    deletePlant(id: number) {
        this.http.delete(`${this.url}/plants/${id}`).subscribe();
    }

    updatePlantImage(id: number, image: File | undefined) {
        if (image == undefined) {
            console.log('image is undefined');
            return;
        }
        const formData = new FormData();
        formData.append('image', image);
        return this.http.put<string>(`${this.url}/images/${id}`, formData);
    }
}
