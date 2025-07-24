import { Component, inject, OnInit } from '@angular/core';
import { CreatePlant } from '../create-plant/create-plant';
import { PlantQuickInfo } from '../plant-quick-info/plant-quick-info';
import { CommonModule } from '@angular/common';
import plantInfo from '../models/plantInfo.model';
import { PlantsService } from '../plants-service';
import { Event, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
    selector: 'app-plants-overview',
    imports: [CreatePlant, CommonModule, PlantQuickInfo],
    templateUrl: './plants-overview.html',
})
export class PlantsOverview implements OnInit {
    router: Router = inject(Router);
    protected plants: plantInfo[] | undefined;
    private routerSubscription: Subscription | undefined;
    private plantsService: PlantsService = inject(PlantsService);

    constructor() {
        this.router.events.pipe(
            filter((e: Event | RouterEvent): e is RouterEvent => e instanceof NavigationEnd && e.url == '/')
        ).subscribe((e: RouterEvent) => {
            console.log(e);
            this.refreshPlants();
        });
    }


    private refreshPlants() {
        this.plantsService.allPlants$.subscribe((plants) => {
            this.plants = plants;
        });
    }

    ngOnInit(): void {
        this.routerSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                console.log("refreshing");
                this.refreshPlants();
            });
    }

    ngOnDestroy(): void {
        this.routerSubscription?.unsubscribe();
    }
}
