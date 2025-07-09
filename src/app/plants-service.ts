import {
    computed,
    inject,
    Injectable,
    Signal,
    computedAsync
} from '@angular/core';
import plantInfo from './models/plantInfo.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class PlantsService {
    private http = inject(HttpClient);

    url = 'http://localhost:8080';

allPlants = computedAsync(
  this.http.get<plantInfo[]>(`${this.url}/plants`),
  []
);


    getPlantById(id: number): Signal<plantInfo | undefined> {
        return computed(() => this.getAllPlants()()
    }
}
