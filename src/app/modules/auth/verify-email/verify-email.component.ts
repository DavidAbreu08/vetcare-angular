/*
 * File: verify-email.component.ts
 * Project: VetCare
 * Created: Thursday, 13th February 2025 7:43:02 pm
 * Last Modified: Friday, 21st March 2025 4:38:16 pm
 * Copyright © 2025 VetCare
 */

import { Component } from '@angular/core';

@Component({
  selector: 'app-verify-email',
  imports: [],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent {

  resendEmail(event: Event){
    event.preventDefault(); 
    console.log('reenviar');
  }
}
