import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
//import { Modal } from 'bootstrap'
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { isatty } from 'tty';
import { MoviesComponent } from "./Components/movies/movies/movies.component";
import { ApiServiceService } from './api-service.service';
import { Movie } from '../../models/data-contracts';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgbModule, MoviesComponent, RouterLink, RouterLinkActive, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cinemaAPI';
  movies = [
    {
      title: 'Movie 1',
      genre: 'Action',
      description: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsumlorem ipsum',
      image: '/assets/avengersinfinity.jpg'
    },
    {
      title: 'Movie 2',
      genre: 'Drama',
      description: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsumlorem ipsum',
      image: '/assets/after.jpg'
    },
    {
      title: 'Movie 3',
      genre: 'Comedy',
      description: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsumlorem ipsum',
      image: '/assets/rivers.jpg'
    },
    {
      title: 'Movie 4',
      genre: 'Thriller',
      description: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsumlorem ipsum',
      image: '/assets/smile.jpg'
    }
  ];

  shows = [
    {
      room: 'CR1',
      date: '26/09',
      time: '16:30'
    },
    {
      room: 'CR2',
      date: '28/09',
      time: '21:15'
    }
  ];

  moviesData:any;
  genres:any;
  countries:any;
  rooms:any;

  showMovie:boolean = false;
  showAllMovies:boolean = false;
  selectedMovie:any;

  username:string=''
  password:string=''

  isAdmin:boolean = false;
  isControlPanel: boolean = false;

  constructor(private modalService: NgbModal, private api:ApiServiceService) {}

ngOnInit() {

  this.api.getAll<Movie>("http://localhost:5120/api/Movie").subscribe((data)=>
    this.moviesData = data
  );

  this.api.getAll<Movie>("http://localhost:5120/api/Genre").subscribe((data)=>
    this.genres = data
  );

  this.api.getAll<Movie>("http://localhost:5120/api/Room").subscribe((data)=>
    this.rooms = data
  );

  console.log("Movies - ", this.moviesData)
  console.log("genres - ", this.genres)
  console.log("rooms - ", this.rooms)

}

  showMovieClick(movie:any){
    //console.log("movie test", movie);
    this.selectedMovie = movie;
    this.showMovie = true;
  }

  buyTicketsClick(movie:any){

  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'loginModalLabel' });
  }

  onSubmit() {
    if (this.username && this.password) {
      // Login logic goes here
      //console.log('username:', this.username);
      //console.log('Password:', this.password);

      //Start
      if(this.username == 'admin' && this.password == '123'){
        this.isAdmin = true;
        console.log(this.isAdmin);
      }
      else{
        this.isAdmin = false;
      }
    }
  }
}
