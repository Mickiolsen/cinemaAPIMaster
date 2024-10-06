import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
//import { Modal } from 'bootstrap'
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { isatty } from 'tty';
import { MoviesComponent } from "./Components/movies/movies/movies.component";
import { ApiServiceService } from './api-service.service';
import { Actor, Country, Genre, Movie, Room, Seat, Show } from '../../models/data-contracts';
import { HttpClientModule } from '@angular/common/http';
import { BlobOptions } from 'buffer';
import { time } from 'console';
import { elementAt, timeInterval } from 'rxjs';
import { Time } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgbModule, MoviesComponent, RouterLink, RouterLinkActive, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cinemaAPI';
  movies2 = [
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

  shows2 = [
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

  movies:Array<Movie> = [];
  genres:Array<Genre> = [];
  countries:Array<Country> = [];
  rooms:Array<Room> = [];
  shows:Array<Show> = [];
  seats:Array<Seat> = [];
  actors:Array<Actor> = [];

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

  roomNumber:string="";
  genreName:string="";
  countryName:string="";
  countryCode:string="";
  seatNumber:number=0;
  seatRow:string="";
  movieName:string="";
  movieDuration:number=0;
  movieTrailer:string="";
  moviePopular:boolean=false;
  movieDescription:string="";
  movieImage:any;
  movieGenreId:number=0;
  showMovieId:number=0;
  showRoomId:number=0;
  showDate:Date=new Date();
  showTime:Time= {hours:0o0, minutes: 0o0};
  showPrice:number = 0;
  actorFirstName:string="";
  actorLastName:string="";
  actorAge:number=0;
  actorCountryId:number=0;

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


    this.api.getAll<Movie>("http://localhost:5120/api/Movie").subscribe((data) => {
      this.moviesData = data; 
      console.log("Movies - ", this.moviesData); 
    });

    // Henter genres
this.api.getAll<Genre>("http://localhost:5120/api/Genre").subscribe((data) => {
  this.genres = data;
  console.log("Genres - ", this.genres); // Logger genres efter de er hentet
});

// Henter rooms
this.api.getAll<Room>("http://localhost:5120/api/Room").subscribe((data) => {
  this.rooms = data;
  console.log("Rooms - ", this.rooms); // Logger rooms efter de er hentet
});

// Henter shows
this.api.getAll<Show>("http://localhost:5120/api/Show").subscribe((data) => {
  this.shows2 = data;
  console.log("Shows - ", this.shows2); // Logger shows efter de er hentet
});

// Henter seats
this.api.getAll<Seat>("http://localhost:5120/api/Seat").subscribe((data) => {
  this.seats = data;
  console.log("Seats - ", this.seats); // Logger seats efter de er hentet
});


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


  //Crud Create Funktioner 
  createRoom(){
    if(this.roomNumber != "" && this.roomNumber != null){
      let params = {
        roomNumber: this.roomNumber
      }
      this.api.create("http://localhost:5120/api/Room", params).subscribe((data) => {
        console.log(data);

        if(data){
          this.roomNumber = ""

          // Henter rooms igen
          this.api.getAll<Room>("http://localhost:5120/api/Room").subscribe((data) => {
            this.rooms = data;
            console.log("Rooms - ", this.rooms); // Logger rooms efter de er hentet
          });

          alert("New Room is created");
        }
      });
    }
    else {
      console.log("Failed to create Room!");
      alert("Failed to create Room!");
    }
    
  }

  createGenre(){
    if(this.genreName != "" && this.genreName != null){
      let params = {
        GenreType: this.genreName
      }
      this.api.create("http://localhost:5120/api/Genre", params).subscribe((data) => {
        console.log(data);

        if(data){
          this.genreName = ""

          this.api.getAll<Genre>("http://localhost:5120/api/Genre").subscribe((data) => {
            this.genres = data;
            console.log("Genres - ", this.genres);
          });

          alert("New Genre is created");
          }
      });
    }
    else{
      alert("Failed to create Genre!");
    }
  }

  createCountry(){
    if(this.countryName != "" && this.countryName != null){
      let params = {
        CountryName: this.countryName,
        CountryCode: this.countryCode
      }

      this.api.create("http://localhost:5120/api/Country", params).subscribe((data) => {
        console.log(data);

        if(data){
          this.countryName = ""
          this.countryCode = ""

          this.api.getAll<Country>("http://localhost:5120/api/Country").subscribe((data) => {
            this.countries = data;
            console.log("Countries - ", this.countries);
          });

          alert("New Country is created");
        }
      });
    }
    else {
      alert("Failed to create Country!");
    }
  }

  createSeat(){
    if(this.seatNumber != 0 && this.seatNumber != null && this.seatRow != "" && this.seatRow != null){
      let params = {
        SeatNumber:this.seatNumber,
        SeatRow:this.seatRow
      }

        this.api.create("http://localhost:5120/api/Seat", params).subscribe((data) => {
          console.log(data);

          if(data){
            this.seatNumber = 0;
            this.seatRow = "";

            this.api.getAll<Seat>("http://localhost:5120/api/Seat").subscribe((data) => {
              this.seats = data;
              console.log("Seats - ", this.seats);
            });

            alert("New Seat is created");
            }
        });
      }
      else{
        alert("Failed to create Seat!");
      }
  }

  createMovie(){
    if(this.movieName != "" && this.movieName != null && this.movieDuration != 0 && this.movieDuration != null && this.movieDescription != "" && this.movieDescription != null && this.movieImage && this.movieImage != null && this.movieGenreId != 0 && this.movieGenreId != null){
      let params = {
        Title: this.movieName,
        DurationMinutes:this.movieDuration,
        TrailerLink:this.movieTrailer,
        IsPopular:this.moviePopular,
        Description:this.movieDescription,
        Image:this.movieImage,
        GenreId:this.movieGenreId
      }

        this.api.create("http://localhost:5120/api/Movie", params).subscribe((data) => {
          console.log(data);

          if(data){
            this.movieName = "";
            this.movieDuration = 0;
            this.movieTrailer = "";
            this.moviePopular = false;
            this.movieDescription = "";
            this.movieImage = "";
            this.movieGenreId = 0;

            this.api.getAll<Movie>("http://localhost:5120/api/Movie").subscribe((data) => {
              this.movies = data;
              console.log("Movies - ", this.movies);
            });

            alert("New Movie is created");
            }
        });
      }
      else{
        alert("Failed to create Movie!");
     }
  }

  createShow(){
    if(this.showMovieId != 0 && this.showMovieId != null && this.showRoomId != 0 && this.showRoomId != null && this.showDate && this.showTime && this.showPrice != 0 && this.showPrice != null){
      let params = {
        RoomId:this.showRoomId,
        MovieId:this.showMovieId,
        Date:this.showDate,
        Time:this.showTime,
        Price:this.showPrice
      }

      this.api.create("http://localhost:5120/api/Show", params).subscribe((data) => {
        console.log(data);

        if(data){
          this.showRoomId = 0;
          this.showMovieId = 0;
          this.showDate = new Date();
          this.showTime = {hours:0o0, minutes: 0o0};
          this.showPrice = 0;

          this.api.getAll<Show>("http://localhost:5120/api/Show").subscribe((data) => {
            this.shows = data;
            console.log("Shows - ", this.shows);
          });

          alert("New Show is created");
          }
      });
    }
    else{
      alert("Failed to create Show!");
    }
  }

  createActor(){
    if(this.actorFirstName != "" && this.actorFirstName != null && this.actorLastName != "" && this.actorLastName != null && this.actorAge != 0 && this.actorAge != null && this.actorCountryId != 0 && this.actorCountryId != null){
      let params = {
        FirstName: this.actorFirstName,
        LastName: this.actorLastName,
        Age: this.actorAge,
        CountryId: this.actorCountryId
      }

      this.api.create("http://localhost:5120/api/Actor", params).subscribe((data) => {
        console.log(data);

        if(data){
          this.actorFirstName = "";
          this.actorLastName = "";
          this.actorAge = 0;
          this.actorCountryId = 0;

          this.api.getAll<Actor>("http://localhost:5120/api/Actor").subscribe((data) => {
            this.actors = data;
            console.log("Actors - ", this.actors);
          });

          alert("New Actor is created");
          }
      });
    }
    else{
      alert("Failed to create Actor!");
    }

  }
  //Crud Create Funktioner END
  
}
