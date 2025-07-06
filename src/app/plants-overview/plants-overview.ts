import { Component } from '@angular/core';
import { CreatePlant } from "../create-plant/create-plant";
import { App } from '../app';
import plantInfo from '../models/plantInfo.model';
import { PlantQuickInfo } from "../plant-quick-info/plant-quick-info";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plants-overview',
  imports: [CreatePlant, CommonModule, PlantQuickInfo],
  templateUrl: './plants-overview.html',
  styleUrl: './plants-overview.css'
})
export class PlantsOverview {
  protected plants: plantInfo[] = [
    // {
    //   id: 0,
    //   name: "amelie",
    //   imagePath: 'favicon.png',
    // },
    // {
    //   id: 1,
    //   name: "amelie",
    //   imagePath: 'favicon.png',
    // }
  ];

}
