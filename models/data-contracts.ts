/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Actor {
  /** @format int32 */
  id?: number;
  /** @minLength 1 */
  firstname: string;
  /** @minLength 1 */
  lastname: string;
  /** @format int32 */
  age: number;
  /** @format int32 */
  countryId?: number;
  country?: Country;
}

export interface Country {
  /** @format int32 */
  id?: number;
  /** @minLength 1 */
  countryName: string;
  countryCode?: string | null;
}

export interface Employee {
  /** @format int32 */
  id?: number;
  /** @minLength 1 */
  firstname: string;
  /** @minLength 1 */
  lastname: string;
  /** @minLength 1 */
  department: string;
  /** @format int32 */
  age: number;
}

export interface Genre {
  /** @format int32 */
  id?: number;
  /** @minLength 1 */
  genretype: string;
}

export interface Movie {
  /** @format int32 */
  id?: number;
  /** @minLength 1 */
  title: string;
  /** @format float */
  durationMinutes: number;
  trailerLink?: string | null;
  isPopular: boolean;
  /** @minLength 1 */
  description: string;
  image?: string | null;
  /** @format binary */
  imageFile?: File | null;
  /** @format int32 */
  genreId?: number | null;
}

export interface Room {
  /** @format int32 */
  id?: number;
  /** @minLength 1 */
  roomNumber: string;
}

export interface Seat {
  /** @format int32 */
  id?: number;
  /** @minLength 1 */
  seatRow: string;
  /** @format int32 */
  seatNumber: number;
  /** @format int32 */
  roomId?: number;
  room?: Room;
}

export interface Show {
  /** @format int32 */
  id?: number;
  /** @format date-time */
  date: string;
  time: TimeSpan;
  /** @format int32 */
  price: number;
  /** @format int32 */
  roomId?: number;
  room?: Room;
  /** @format int32 */
  movieId?: number;
  movie?: Movie;
}

export interface Ticket {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  seatId?: number;
  /** @format int32 */
  showId?: number;
}

export interface TimeSpan {
  /** @format int64 */
  ticks?: number;
  /** @format int32 */
  days?: number;
  /** @format int32 */
  hours?: number;
  /** @format int32 */
  milliseconds?: number;
  /** @format int32 */
  microseconds?: number;
  /** @format int32 */
  nanoseconds?: number;
  /** @format int32 */
  minutes?: number;
  /** @format int32 */
  seconds?: number;
  /** @format double */
  totalDays?: number;
  /** @format double */
  totalHours?: number;
  /** @format double */
  totalMilliseconds?: number;
  /** @format double */
  totalMicroseconds?: number;
  /** @format double */
  totalNanoseconds?: number;
  /** @format double */
  totalMinutes?: number;
  /** @format double */
  totalSeconds?: number;
}
