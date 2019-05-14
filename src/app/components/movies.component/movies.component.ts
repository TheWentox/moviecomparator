import { Component, HostListener } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { Movie } from 'src/app/models/Movie';

@Component({
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent {


  public movies: Array<Movie> = new Array<Movie>();
  private pageIndex = 1;
  private year = new Date().getFullYear();
  public loaded = false;

  public error = "";
  public x: Movie = new Movie();
  public y: Movie = new Movie();

  public cast = "";
  public director = "";

  constructor(private movieService: MovieService) {
    this.loadMovies(this.year, this.pageIndex);
  }

  loadMovies(year: number, pageIndex: number) {
    this.loaded = false;
    this.movieService.getPopularMovies(year, pageIndex).subscribe(movies => {
      if (movies.length > 0) {
        for (let movie of movies) {
          this.movies.push(movie);
        }
        this.loaded = true;
      }
    });
  }


  nextPage() {
    this.pageIndex++;
    this.loadMovies(this.year, this.pageIndex);
  }


  pick(movie: Movie) {
    if (this.x.title == "") {
      this.x = movie;
    }
    else if (this.x.title != "" && this.y.title == "") {
      this.y = movie;
    }


    if (this.x.title && this.y.title) {
      // this
    }
    this.x.winner = false;
    this.y.winner = false;

  }


  compare() {

    let comparable = false;

    for (let genre of this.x.genre_ids) {
      if (this.y.genre_ids.indexOf(genre) > -1) {
        comparable = true;
      }
    }


    for (let genre of this.y.genre_ids) {
      if (this.x.genre_ids.indexOf(genre) > -1) {
        comparable = true;
      }
    }

    if (comparable == false) {
      this.error = "Nem összehasonlítható";
      return;
    }




    if (this.x.vote_average > this.y.vote_average) {
      this.x.winner = true;
    }
    else {
      this.movieService.getCredits(this.x);
      this.y.winner = true;
    }


    let w = new Movie();

    if (this.x.winner) {
      w = this.x;
    }
    else {
      w = this.y;
    }

    this.movieService.getCredits(w).subscribe(json => {
      if (json == undefined) return;
      this.director = "";
      this.cast = "";
      this.director = json.crew[0].name;
      for (let cast of json.cast.slice(0, 5)) {
        this.cast = this.cast + cast.name + ", ";
      }
      this.cast = this.cast.slice(0, -2);
    });
  }

  reset() {
    this.error = "";
    this.x = new Movie();
    this.y = new Movie();
  }

  remove_y(){
    this.error = "";
    this.y = new Movie();
  }
  remove_x(){
    this.error = "";
    this.x = new Movie();
  }


}
