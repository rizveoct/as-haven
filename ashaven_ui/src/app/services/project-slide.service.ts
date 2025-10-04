import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Slide } from '../models/model';


@Injectable()
export class ProjectSlideService {
  private apiUrl = 'api/slides'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  getSlides(): Observable<Slide[]> {
    // Mock data; replace with actual API call
    const slides: Slide[] = [
      {
        image: 'images/h1.jpg',
        alt: 'Animal 1',
        author: 'LUNDEV',
        title: 'DESIGN SLIDER',
        topic: 'ANIMAL',
        description:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde, eaque optio ratione aliquid assumenda facere ab et quasi ducimus aut doloribus non numquam. Explicabo, laboriosam nisi reprehenderit tempora at laborum natus unde. Ut, exercitationem eum aperiam illo illum laudantium?',
        thumbnailTitle: 'Name Slider',
        thumbnailDescription: 'Description',
      },
      {
        image: 'images/h2.jpg',
        alt: 'Animal 2',
        author: 'LUNDEV',
        title: 'DESIGN SLIDER',
        topic: 'ANIMAL',
        description:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde, eaque optio ratione aliquid assumenda facere ab et quasi ducimus aut doloribus non numquam. Explicabo, laboriosam nisi reprehenderit tempora at laborum natus unde. Ut, exercitationem eum aperiam illo illum laudantium?',
        thumbnailTitle: 'Name Slider',
        thumbnailDescription: 'Description',
      },
      {
        image: 'images/h3.jpg',
        alt: 'Animal 3',
        author: 'LUNDEV',
        title: 'DESIGN SLIDER',
        topic: 'ANIMAL',
        description:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde, eaque optio ratione aliquid assumenda facere ab et quasi ducimus aut doloribus non numquam. Explicabo, laboriosam nisi reprehenderit tempora at laborum natus unde. Ut, exercitationem eum aperiam illo illum laudantium?',
        thumbnailTitle: 'Name Slider',
        thumbnailDescription: 'Description',
      },
      {
        image: 'images/a2.jpg',
        alt: 'Animal 4',
        author: 'LUNDEV',
        title: 'DESIGN SLIDER',
        topic: 'ANIMAL',
        description:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde, eaque optio ratione aliquid assumenda facere ab et quasi ducimus aut doloribus non numquam. Explicabo, laboriosam nisi reprehenderit tempora at laborum natus unde. Ut, exercitationem eum aperiam illo illum laudantium?',
        thumbnailTitle: 'Name Slider',
        thumbnailDescription: 'Description',
      },
    ];
    return of(slides); // Use this.http.get<Slide[]>(this.apiUrl) for real API
  }
}
