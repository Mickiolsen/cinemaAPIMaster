import { Injectable } from '@angular/core';
import { Movie } from '../../models/data-contracts';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http:HttpClient) { }

 // static async getMovieById(id:number | null | undefined = 0): Promise<Movie | null > {
 //   try {
 //     if(id == undefined || id == null || id == 0){
 //       return null;
 //     }
//
 //     const res = await fetch(`http://localhost:5120/api/Movie/${id}`, {
 //       method: 'GET',
 //       headers: {
 //           'Content-Type': 'application/json',
 //           'Accept': 'application/json'
 //       },
 //     });
//
 //     if(!res.ok){
 //       console.log(await res.json());
 //       return null;
 //     }
//
 //     const data: Movie = await res.json();
 //     return data;
//
 //   } catch (error) {
 //     console.log(error);
 //     return null;
 //   }
 // }

 // static async getMovies(): Promise<Movie[] | null > {
 //   try {
 //     const res = await fetch('http://localhost:5120/api/Movie', {
 //       method: 'GET',
 //       headers: {
 //           'Content-Type': 'application/json',
 //           'Accept': 'application/json'
 //       },
 //     });
//
 //     if(!res.ok){
 //       console.log(await res.json());
 //       return null;
 //     }
//
 //     const data: Movie[] = await res.json();
 //     return data;
//
 //   } catch (error) {
 //     console.log(error);
 //     return null;
 //   }
 // }
//
 // static async deleteMovieById(id:number | null | undefined = 0): Promise<Movie | null > {
  //  try {
  //    if(id == undefined || id == null || id == 0){
  //      return null;
  //    }
//
  //    const res = await fetch(`http://localhost:5120/api/Movie/${id}`, {
  //      method: 'DELETE',
  //      headers: {
  //          'Content-Type': 'application/json',
  //          'Accept': 'application/json'
  //      },
  //    });
//
  //    if(!res.ok){
  //      console.log(await res.json());
  //      return null;
  //    }
//
  //    const data: Movie = await res.json();
  //    return data;
//
  //  } catch (error) {
  //    console.log(error);
  //    return null;
  //  }
  //}


  // Get All
  

  getAll<T>(url: string):Observable<T[]>{
    return this.http.get<T[]>(url);
  }

  // Get by Id
  getById<T>(url: string):Observable<T>{
    return this.http.get<T>(url);
  }

  // Post
  create<T>(url: string, params:any):Observable<T>{
    return this.http.post<T>(url, params);
  }

  // Delete
  delete<T>(url: string):Observable<T>{
    return this.http.delete<T>(url);
  }
}
