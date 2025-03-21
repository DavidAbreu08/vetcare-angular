/*
 * File: recover-pass.component.ts
 * Project: VetCare
 * Created: Thursday, 13th February 2025 7:43:02 pm
 * Last Modified: Friday, 21st March 2025 4:26:05 pm
 * Copyright © 2025 VetCare
 */

import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-recover-pass',
  imports: [RouterLink],
  templateUrl: './recover-pass.component.html',
  styleUrl: './recover-pass.component.scss'
})
export class RecoverPassComponent {
  constructor(
    private readonly router: Router
  ){}
  
}
