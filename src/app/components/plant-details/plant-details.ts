import { Component, ElementRef, inject, ViewChild, viewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PlantImage } from "../plant-image/plant-image";
import { FormsModule } from '@angular/forms';
import { ComputeWateredDaysAgoPipe } from '../../pipes/compute-watered-days-ago-pipe';
import { ValueToColorPipe } from '../../pipes/value-to-color-pipe';
import Plant from '../../models/plantInfo.model';
import { PlantsService } from '../../services/plants-service';

@Component({
    selector: 'app-plant-details',
    imports: [
        ComputeWateredDaysAgoPipe,
        ValueToColorPipe,
        DatePipe,
        RouterLink,
        PlantImage,
        FormsModule

    ],
    templateUrl: './plant-details.html',
})
export class PlantDetails {
    router: Router = inject(Router);
    service: PlantsService = inject(PlantsService);
    route: ActivatedRoute = inject(ActivatedRoute);
    plant?: Plant;
    baseUrl: string = window.location.origin;
    selectedDate: string;
    @ViewChild("plantNameHeading") plantNameHeading!: ElementRef<HTMLHeadingElement>;

    constructor() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.service.getPlantById(id).subscribe((plant) => {
            if (plant == null) {
                this.router.navigate(['']);
            }
            this.plant = plant;
        });
        const today = new Date();
        this.selectedDate = today.toISOString().split('T')[0];
    }

    deletePlant() {
        if (
            this.plant != null &&
            confirm('Are you sure you want to delete this plant?')
        ) {
            this.service.deletePlant(this.plant.id);
            this.router.navigate(['']);
        }
    }

    waterPlant() {
        if (this.plant == undefined) {
            return;
        }
        this.service.waterPlant(this.plant, this.selectedDate);
    }

    renamePlant(event: KeyboardEvent) {
        if (event.key !== "Enter") {
            return;
        }
        event.preventDefault();

        if (this.plantNameHeading.nativeElement.textContent == null) {
            console.log("plantNameHeading is null");
            return;
        }
        if (this.plant == undefined) {
            console.log("Plant is undefined");
            return;
        }

        this.service.renamePlant(this.plantNameHeading.nativeElement.textContent, this.plant);
        this.plantNameHeading.nativeElement.blur();
    }
}
