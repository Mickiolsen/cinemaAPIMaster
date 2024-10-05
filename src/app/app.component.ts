import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
//import { Modal } from 'bootstrap'
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { isatty } from 'tty';
import { MoviesComponent } from "./Components/movies/movies/movies.component";
import { ApiServiceService } from './api-service.service';
import { Genre, Movie, Room, Show } from '../../models/data-contracts';
import { HttpClientModule } from '@angular/common/http';
import { BlobOptions } from 'buffer';
import { time } from 'console';

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
  shows2:any;
  seats:any;

  // Oprettelse af tickets
  tickets:Array<any> = new Array();
  ticketMovie:any;
  ticketDate:any;
  ticketTime:any;
  ticketRoom:any;

  showMovie:boolean = false;
  showAllMovies:boolean = false;
  selectedMovie:any;

  username:string=''
  password:string=''

  isAdmin:boolean = false;
  isControlPanel: boolean = false;

  buyTicket:boolean = false;
  chooseSeats:boolean = false;
  showTickets:boolean = false;



  //Valg af sæde variabler
  ticketCount: number = 0;
  selectedSeats: number[] = [];

  seats2: number[] = Array(100).fill(0).map((_, index) => index + 1); // 100 sæder

  constructor(private modalService: NgbModal, private api:ApiServiceService) {}

ngOnInit() {
  // Tjek om man er logget ind som admin
  const isAdminLS  = localStorage.getItem("admin");

  if(isAdminLS == "true"){
    this.isAdmin = true;
  }
  else{
    this.isAdmin = false;
  }


  // For Test af post api kald virker eller ej
  let params = {
    roomNumber: "CR5"
  }

  this.api.create<Room>("http://localhost:5120/api/Room", params).subscribe((data: any)=>
    console.log(data)
  );
  ////////////////////////////////////////////////////////////////////////////////////////////

  this.api.getAll<Movie>("http://localhost:5120/api/Movie").subscribe((data)=>
    this.moviesData = data
  );

  this.api.getAll<Genre>("http://localhost:5120/api/Genre").subscribe((data)=>
    this.genres = data
  );

  this.api.getAll<Room>("http://localhost:5120/api/Room").subscribe((data)=>
    this.rooms = data
  );

  this.api.getAll<Show>("http://localhost:5120/api/Show").subscribe((data)=>
    this.shows2 = data
  );

  this.api.getAll<Show>("http://localhost:5120/api/Seat").subscribe((data)=>
    this.seats = data
  );

  console.log("Movies - ", this.moviesData);
  console.log("genres - ", this.genres);
  console.log("rooms - ", this.rooms);
  console.log("shows - ", this.shows);

}

  showMovieClick(movie:any){
    //console.log("movie test", movie);
    this.selectedMovie = movie;
    this.showMovie = true;
  }

  buyTicketsClick(movie:any){
    this.selectedMovie = movie;
    this.buyTicket = true;  
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'loginModalLabel' });
  }

  onSubmit() {
    if (this.username && this.password) {
      //console.log('username:', this.username);
      //console.log('Password:', this.password);

      if(this.username == 'admin' && this.password == '123'){
        this.isAdmin = true;
        localStorage.setItem("admin", "true");
        console.log(this.isAdmin);
      }
      else{
        this.isAdmin = false;
        this.username = "";
        this.password = "";
      }
    }
  }


  // Sæde valg funktioner
  // Opdater antallet af billetter
  updateTicketCount(count: number) {
    this.ticketCount = count;
    this.selectedSeats = []; // Nulstil valgte sæder ved ændring
  }

  // Toggle sædevalg
  toggleSeatSelection(seatNumber: number) {
    if (this.selectedSeats.includes(seatNumber)) {
      this.selectedSeats = this.selectedSeats.filter(seat => seat !== seatNumber);
    } else if (this.selectedSeats.length < this.ticketCount) {
      this.selectedSeats.push(seatNumber);
    }
  }

  // Tjek om et sæde er valgt
  isSelected(seatNumber: number): boolean {
    return this.selectedSeats.includes(seatNumber);
  }

   // Sæde valg funktioner END


  createTicket(){
    if(this.ticketCount >= 1 && this.selectedSeats.length >= 1){
      this.selectedSeats.forEach(element => {
        this.tickets.push({
          ticketmovie: this.selectedMovie,
          ticketdate: this.ticketDate,
          tickettime: this.ticketTime,
          seat: element,
          room: this.ticketRoom
        })
      });
      
      console.log(this.tickets);
      this.showTickets = true; 
    }
    
  }

  resetAll(){
    this.buyTicket = false;
    this.updateTicketCount(0);
    this.chooseSeats = false;
    this.showTickets = false;
    this.tickets = new Array();
    this.selectedSeats = new Array();

    this.ticketDate = new Date();
    this.ticketTime = new Date();
  }

  logoutClick(){
    if(confirm('Are you sure you want to logout of your admin user?')){
      this.isControlPanel = false;
      this.isAdmin = false;
      localStorage.setItem("admin", "false");

      this.username = "";
      this.password = "";

      this.resetAll();
    }
  }

}
