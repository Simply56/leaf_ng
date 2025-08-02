import { Component, inject } from '@angular/core';
import { CreatePlant } from '../create-plant/create-plant';
import { PlantQuickInfo } from '../plant-quick-info/plant-quick-info';
import { AsyncPipe, CommonModule } from '@angular/common';
import { PlantsService } from '../plants-service';

@Component({
    selector: 'app-plants-overview',
    imports: [CreatePlant, CommonModule, PlantQuickInfo, AsyncPipe],
    templateUrl: './plants-overview.html',
})
export class PlantsOverview {
    service = inject(PlantsService);
}
