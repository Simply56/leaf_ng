import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlantsService } from './services/plants-service';
import { ThemeService } from './services/theme-service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    protected title = 'Leaf';
    protected theme = inject(ThemeService);
    protected plants = inject(PlantsService);
}
