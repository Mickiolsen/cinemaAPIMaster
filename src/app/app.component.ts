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
import { mainModule } from 'process';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgbModule, MoviesComponent, RouterLink, RouterLinkActive, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cinemaAPI';
 
  moviesWithActors:Array<any> = [];
  filteredMovies:Array<Movie> = [];
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
  deleteMovies:boolean = false;

  buyTicket:boolean = false;
  chooseSeats:boolean = false;
  showTickets:boolean = false;

  roomNumber:string="";
  genreName:string="";
  countryName:string="";
  countryCode:string="";
  seatNumber:number=0;
  seatRow:string="";
  seatRoom:number=0;
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

  availableDates: string[] = [];
  filteredTimes: string[] = [];
  selectedDate: string | null = null;
  selectedTime: string | null = null;
  selectedShow:any;

  userEmail:string="";
  movieGenreName:any;

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

// Henter movies
this.api.getAll<Movie>("http://localhost:5120/api/Movie").subscribe((data) => {
  this.movies = data;
  this.filteredMovies = data; 
  console.log("Movies - ", this.movies); 
});

// Henter movies med skuespillere
//this.api.getAll<Movie>("http://localhost:5120/api/Movie/with-actors").subscribe((data) => {
//  this.moviesWithActors = data; 
//  console.log("MoviesWithActors - ", this.moviesWithActors); 
//});

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

// Henter Countries
this.api.getAll<Country>("http://localhost:5120/api/Country").subscribe((data) => {
  this.countries = data;
  console.log("Country - ", this.countries); // Logger countries efter de er hentet
});

// Henter shows
this.api.getAll<Show>("http://localhost:5120/api/Show").subscribe((data) => {
  this.shows = data;
  console.log("Shows - ", this.shows); // Logger shows efter de er hentet
});

// Henter seats
this.api.getAll<Seat>("http://localhost:5120/api/Seat").subscribe((data) => {
  this.seats = data;
  console.log("Seats - ", this.seats); // Logger seats efter de er hentet
});

// Henter Actors
this.api.getAll<Actor>("http://localhost:5120/api/Actor").subscribe((data) => {
  this.actors = data;
  console.log("Actors - ", this.actors); // Logger seats efter de er hentet
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

    this.filterDatesByMovie();
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
    
    if (this.selectedSeats.includes(seatNumber)) 
    {
      this.selectedSeats = this.selectedSeats.filter(seat => seat !== seatNumber);
    } 
    else if (this.selectedSeats.length < this.ticketCount) 
    {
      this.selectedSeats.push(seatNumber);
    }
  }

  // Tjek om et sæde er valgt
  isSelected(seatNumber: number): boolean {
    return this.selectedSeats.includes(seatNumber);
  }
  // Sæde valg funktioner END


  createTicket() {
    let selectedRoom = this.rooms.find(room => room.id == this.selectedShow.roomId);
  
    if (this.ticketCount >= 1 && this.selectedSeats.length >= 1) {
      this.selectedSeats.forEach(seatNumber => {
        // Find the seat object based on the seat number
        let selectedSeat = this.seats.find(seat => seat.seatNumber === seatNumber);
        
        this.tickets.push({
          ticketmovie: this.selectedMovie,
          ticketdate: this.selectedDate,
          tickettime: this.selectedTime,
          seatNumber: seatNumber, // This remains the seat number
          seatRow: selectedSeat ? selectedSeat.seatRow : '', // Get the seat row
          room: selectedRoom?.roomNumber
        });
      });
  
      console.log("SelectedShow roomnumber", selectedRoom);
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

    this.availableDates = [];
    this.filteredTimes = [];
    this.selectedDate = null;
    this.selectedTime = null;
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
        countryCode: this.countryCode,
        countryName: this.countryName
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
    if(this.seatNumber != 0 && this.seatNumber != null && this.seatRow != "" && this.seatRow != null && this.seatRoom != null && this.seatRoom != 0){
      let params = {
        SeatRow:this.seatRow,
        SeatNumber:this.seatNumber,
        RoomId:this.seatRoom
      }

        this.api.create("http://localhost:5120/api/Seat", params).subscribe((data) => {
          console.log(data);

          if(data){
            this.seatNumber = 0;
            this.seatRow = "";
            this.seatRoom = 0;

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

 // createMovie(){
 //   if(this.movieName != "" && this.movieName != null && this.movieDuration != 0 && this.movieDuration != null && this.movieDescription != "" && this.movieDescription != null && this.movieImage && this.movieImage != null && this.movieGenreId != 0 && this.movieGenreId != null){
 //     let ImageFile = null;
 //     
 //     let params = {
 //       Title: this.movieName,
 //       DurationMinutes:this.movieDuration,
 //       TrailerLink:this.movieTrailer,
 //       IsPopular:this.moviePopular,
 //       Description:this.movieDescription,
 //       Image:this.movieImage,
 //       GenreId:this.movieGenreId,
 //       ImageFile:ImageFile
 //     }
//
 //       this.api.create("http://localhost:5120/api/Movie", params).subscribe((data) => {
 //         console.log(data);
//
 //         if(data){
 //           this.movieName = "";
 //           this.movieDuration = 0;
 //           this.movieTrailer = "";
 //           this.moviePopular = false;
 //           this.movieDescription = "";
 //           this.movieImage = "";
 //           this.movieGenreId = 0;
//
 //           this.api.getAll<Movie>("http://localhost:5120/api/Movie").subscribe((data) => {
 //             this.movies = data;
 //             console.log("Movies - ", this.movies);
 //           });
//
 //           alert("New Movie is created");
 //           }
 //       });
 //     }
 //     else{
 //       alert("Failed to create Movie!");
 //    }
 // }

  createMovie() {
    if (this.movieName != "" && this.movieName != null && 
        this.movieDuration != 0 && this.movieDuration != null && 
        this.movieDescription != "" && this.movieDescription != null && 
        this.movieImage && this.movieImage != null && 
        this.movieGenreId != 0 && this.movieGenreId != null) {
          
          let Imagepath = "";
      // Opret FormData til at håndtere både filmdata og billede
      const formData = new FormData();
      formData.append("Title", this.movieName);
      formData.append("DurationMinutes", this.movieDuration.toString());
      formData.append("TrailerLink", this.movieTrailer);
      formData.append("IsPopular", this.moviePopular.toString());
      formData.append("Description", this.movieDescription);
      formData.append("GenreId", this.movieGenreId.toString());
      //formData.append("Image",  Imagepath);
  
      // Vedhæft billedfilen
      formData.append("ImageFile", this.movieImage); // Brug det korrekte input for billedet
  
      this.api.create("http://localhost:5120/api/Movie", formData).subscribe((data) => {
        console.log(data);
  
        if (data) {
          this.movieName = "";
          this.movieDuration = 0;
          this.movieTrailer = "";
          this.moviePopular = false;
          this.movieDescription = "";
          this.movieImage = null; // Reset billedet
          this.movieGenreId = 0;
  
          // Opdater filmene efter oprettelse
          this.api.getAll<Movie>("http://localhost:5120/api/Movie").subscribe((data) => {
            this.movies = data;
            console.log("Movies - ", this.movies);
          });
  
          alert("New Movie is created");
        }
      });
    } else {
      alert("Failed to create Movie!");
    }
  }
  

  createShow(){
    if(this.showMovieId != 0 && this.showMovieId != null && this.showRoomId != 0 && this.showRoomId != null && this.showDate && this.showTime && this.showPrice != 0 && this.showPrice != null){
      let params = {
        Date:this.showDate,
        Time:this.showTime,
        Price:this.showPrice,
        RoomId:this.showRoomId,
        MovieId:this.showMovieId
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

  deleteMovie(movieId: any) {
    if (confirm("Are you sure you want to delete this movie?")) {
      this.api.deleteMovie(movieId).subscribe({
        next: () => {
          // Remove the movie from the list locally
          this.movies = this.movies.filter(movie => movie.id !== movieId);
          alert("Movie deleted successfully!");
        },
        error: (err) => {
          console.log('Error deleting movie:', err);
          alert("Failed to delete movie. Please try again.");
        }
      });
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.movieImage = file; // Gemmer den valgte fil
    }
  }

  // Filtrer datoer ud fra den valgte filmId
  filterDatesByMovie() {
    const movieShows = this.shows.filter(show => show.movieId === this.selectedMovie.id);
    // Ekstrakt kun unikke datoer og formatér dem
    this.availableDates = [...new Set(movieShows.map(show => this.formatDate(show.date)))];

    this.selectedShow = movieShows[0];

    console.log("selectedmovieid", this.selectedMovie.id);
    console.log("showmovieid", this.shows.filter(show => show.movieId === this.selectedMovie.id));
    console.log("availableDates", this.availableDates);
  }

  // Når dato ændres, filtrer tilgængelige tider
  onDateChange() {
    if (this.selectedDate) {
      this.filteredTimes = this.shows
        .filter(show => show.movieId === this.selectedMovie.id && this.formatDate(show.date) === this.selectedDate)
        .map(show => this.formatTime(show.time)); // Formatér tidspunkterne korrekt
    } else {
      this.filteredTimes = [];
    }
  }

  // Funktion til at formatere `DateTime` fra API til en dato uden tid
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Sørg for, at dag har to cifre
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returnerer 0-indekseret måned
    const year = date.getFullYear();
  
    // Returnér datoen i 'dd-MM-yyyy' format
    return `${day}-${month}-${year}`;
  }

  // Funktion til at formatere `TimeSpan` fra API til et læsbart tidsformat
  formatTime(timeString:any): string {
    // TimeSpan kommer som f.eks. '14:00:00', vi vil kun have 'HH:mm'
    return timeString.substring(0, 5);
  }

  sendEmail(mail:string){
    if(mail){
      alert("Ticket sent to " + mail);
    }
    else {
      alert("Email field needs to be filled!" + mail);
    }
  }


  // Metode for at hente genrenavn baseret på genreId
  getGenreName(genreId:any): string {
    const genre = this.genres.find(g => g.id === genreId);
    return genre ? genre.genretype : 'Unknown Genre'; // Assuming 'name' is the genre name
  }

  openYoutubeVideo(url: string) {
    if (url) {
      window.open(url, '_blank'); // Åbner URL'en i en ny fane
    } else {
      console.error('Ingen gyldig URL til videoen');
    }
  }

  onGenreChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement; // Cast to HTMLSelectElement
    const genreId = selectElement.value; // Get the selected value from the select element
  
    console.log("genreId:", genreId); // Debugging line
  
    if (genreId) {
      this.filteredMovies = this.movies.filter(movie => movie.genreId === +genreId);
    } else {
      this.filteredMovies = this.movies; // Show all movies if no genre is selected
    }
  }

  
}
