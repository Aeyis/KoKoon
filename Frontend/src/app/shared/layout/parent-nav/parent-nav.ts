import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-parent-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './parent-nav.html',
  styleUrl: './parent-nav.scss',
})
export class ParentNav {}
