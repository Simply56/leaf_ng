import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreatePlant } from "./create-plant/create-plant";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CreatePlant],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'leaf_ng';
}
