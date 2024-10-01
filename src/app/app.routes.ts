import { RouterModule, Routes } from '@angular/router';
import { MoviesComponent } from '../../src/app/Components/movies/movies/movies.component'
import { NgModule } from '@angular/core';


export const routes: Routes = [
    { path: 'movies', component: MoviesComponent },  // Define the route for the Movie component
];

//@NgModule({
//    imports: [RouterModule.forRoot(routes)],  // Initialize routing
//    exports: [RouterModule]  // Export for use in other modules
//  })


