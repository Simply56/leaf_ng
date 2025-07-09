import { Injectable } from '@angular/core';
import plantInfo from './models/plantInfo.model';

@Injectable({
    providedIn: 'root',
})
export class PlantsService {
    protected plantsList: plantInfo[] = [
        {
            id: 0,
            name: 'amelie',
            imagePath: 'favicon.png',
            lastWatered: new Date(2025, 6, 4),
        },
        {
            id: 1,
            name: 'joline',
            imagePath: 'favicon.png',
            lastWatered: new Date(),
        },
    ];

    getAllPlants(): plantInfo[] {
        return this.plantsList;
    }

    getPlantById(id: number): plantInfo | undefined {
        return this.plantsList.find((p) => p.id === id);
    }
}
