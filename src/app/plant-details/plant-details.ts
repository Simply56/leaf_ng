import { Component, inject } from '@angular/core';
import plantInfo from '../models/plantInfo.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlantsService } from '../plants-service';
import { ComputeWateredDaysAgoPipe } from '../compute-watered-days-ago-pipe';
import { ValueToColorPipe } from '../value-to-color-pipe';
import { DatePipe } from '@angular/common';
import { PlantImage } from "../plant-image/plant-image";

@Component({
    selector: 'app-plant-details',
    imports: [
    ComputeWateredDaysAgoPipe,
    ValueToColorPipe,
    DatePipe,
    RouterLink,
    PlantImage
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
        this.plantService.getPlantById(id).subscribe((plant) => {
            this.plant = plant;
            if (this.plant == null) {
                this.router.navigate(['']);
            }
        });
    }

    deletePlant() {
        if (
            this.plant != null &&
            confirm('Are you sure you want to delete this plant?')
        ) {
            this.plantService.deletePlant(this.plant.id);
            this.router.navigate(['']);
        }
    }
}
