import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDetailsService } from '../user-details.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent {
  user: any;
  isLoading = true;

  constructor(private route: ActivatedRoute, private userDetailsService: UserDetailsService, private router: Router,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    const userId:any = this.route.snapshot.paramMap.get('id');
    this.loadUserDetails(userId);
  }

  loadUserDetails(userId: number): void {
    this.isLoading = true;
    this.userDetailsService.fetchUserDetails(userId).subscribe((response: any) => {
      this.user = response.data;
      this.isLoading = false;
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

}
