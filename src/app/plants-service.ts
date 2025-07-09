import {
    computed,
    inject,
    Injectable,
    Signal,
} from '@angular/core';
import plantInfo from './models/plantInfo.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PlantsService {
    private http = inject(HttpClient);

    url = 'http://localhost:8080';

    allPlants$ = (
        this.http.get<plantInfo[]>(`${this.url}/plants`)
    );


    getPlantById(id: number) {
        return this.allPlants$.pipe(map((plants => plants.find((p => p.id == id)))));
    }
}
