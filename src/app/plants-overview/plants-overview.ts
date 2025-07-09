import { Component, inject } from '@angular/core';
import { CreatePlant } from '../create-plant/create-plant';
import { PlantQuickInfo } from '../plant-quick-info/plant-quick-info';
import { CommonModule } from '@angular/common';
import plantInfo from '../models/plantInfo.model';
import { PlantsService } from '../plants-service';

@Component({
    selector: 'app-plants-overview',
    imports: [CreatePlant, CommonModule, PlantQuickInfo],
    templateUrl: './plants-overview.html',
})
export class PlantsOverview {
    protected plants: plantInfo[] = [];
    private plantsService: PlantsService = inject(PlantsService);
    constructor() {
        this.plants = this.plantsService.getAllPlants();
    }
}
