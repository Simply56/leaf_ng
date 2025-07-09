import { Component, inject } from '@angular/core';
import plantInfo from '../models/plantInfo.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlantsService } from '../plants-service';
import { ComputeWateredDaysAgoPipe } from '../compute-watered-days-ago-pipe';
import { ValueToColorPipe } from '../value-to-color-pipe';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-plant-details',
    imports: [
        ComputeWateredDaysAgoPipe,
        ValueToColorPipe,
        DatePipe,
        RouterLink,
    ],
    templateUrl: './plant-details.html',
})
export class PlantDetails {
    router: Router = inject(Router);
    plantService: PlantsService = inject(PlantsService);
    route: ActivatedRoute = inject(ActivatedRoute);
    plant: plantInfo | undefined;
    baseUrl: string = window.location.origin;

    constructor() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.plantService.getPlantById(id).subscribe(plant => {
            this.plant = plant;
        });
        if (this.plant == null) {
            this.router.navigate(['']);
        }
    }

    deletePlant() {
        confirm('Are you sure you want to delete this plant?');
    }
}
