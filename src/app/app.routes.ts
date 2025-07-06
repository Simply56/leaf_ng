import { Routes } from '@angular/router';
import { PlantDetails } from './plant-details/plant-details';
import { PlantsOverview } from './plants-overview/plants-overview';

export const routes: Routes = [
    {
        path: '',
        component: PlantsOverview
    },
    {
        path: 'plant/:id',
        component: PlantDetails,
    }
];
