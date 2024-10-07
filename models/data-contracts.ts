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

export interface DateOnly {
  /** @format int32 */
  year?: number;
  /** @format int32 */
  month?: number;
  /** @format int32 */
  day?: number;
  dayOfWeek?: DayOfWeek;
  /** @format int32 */
  dayOfYear?: number;
  /** @format int32 */
  dayNumber?: number;
}

/** @format int32 */
export enum DayOfWeek {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
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
  /** @minLength 1 */
  image: string;
  /** @format int32 */
  genreId?: number;
  genre?: Genre;
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
  date: DateOnly;
  time: TimeOnly;
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

export interface TimeOnly {
  /** @format int32 */
  hour?: number;
  /** @format int32 */
  minute?: number;
  /** @format int32 */
  second?: number;
  /** @format int32 */
  millisecond?: number;
  /** @format int32 */
  microsecond?: number;
  /** @format int32 */
  nanosecond?: number;
  /** @format int64 */
  ticks?: number;
}
