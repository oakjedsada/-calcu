import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-card',
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  dogs = [
    {
      name: 'Shiba Inu',
      breed: 'Dog Breed',
      img: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
      desc: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally bred for hunting.',
    },
    {
      name: 'Siberian Husky',
      breed: 'Dog Breed',
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/320px-Camponotus_flavomarginatus_ant.jpg',
      desc: 'The Siberian Husky is a medium-sized working sled dog breed. It is a thickly furred double coat, erect triangular ears, and distinctive markings, and is smaller than the similar-looking Alaskan Malamute.',
    },
    {
      name: 'Pembroke Welsh Corgi',
      breed: 'Dog Breed',
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Welsh_Corgi_Pembroke.JPG/320px-Welsh_Corgi_Pembroke.JPG',
      desc: 'The Pembroke Welsh Corgi is a cattle herding dog breed that originated in Pembrokeshire, Wales. It is one of two breeds known as Welsh Corgi, along with the Cardigan Welsh Corgi.',
    },
  ];
}
