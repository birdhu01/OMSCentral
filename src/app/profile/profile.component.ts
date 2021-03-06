import { Component, OnInit } from '@angular/core';
import { AuthService } from '../firebase/auth.service';
import { FormControl, FormBuilder } from '@angular/forms';
import { UserService } from '../core/user.service';
import { Observable } from 'rxjs';
import { ReviewService } from '../reviews/review.service';
import { LocalStorageService } from '../core/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'oms-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  auth: any = {};
  user: any;
  user$: Observable<any>;
  reviews$: Observable<any[]>;
  specializations = [
    'Computational Perception & Robotics',
    'Computing Systems',
    'Interactive Intelligence',
    'Machine Learning',
  ];
  anonymous = false;
  specialization = null;
  profileForm: any = {};

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private reviewService: ReviewService,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.auth = this.authService.user.subscribe(auth => {
      this.auth = auth;
      this.reviews$ = this.reviewService.getReviewsByAuthor(this.auth.uid);
    });
  }

  ngOnInit() {
    // this.profileForm = this.fb.group({
    //   specialization: null
    // });
    // this.profileForm.valueChanges.subscribe(values => {
    //   this.specialization = values.specialization;
    //   if (values.specialization !== null && this.user.specialization !== values.specialization) {
    //     this.user.specialization = values.specialization;
    //     this.userService.updateInfo(this.user, this.auth);
    //   }
    // });
    this.user$ = this.userService.getUser();
    this.user$.subscribe(user => {
      if (user && Object.keys(user).length !== 0) {
        this.user = user;
        // this.anonymous = user.anonymous;
        // if (this.specialization !== user.specialization) {
        //   this.profileForm.setValue({specialization: user.specialization || null});
        // }
      }
    });
  }

  changeAnonymous() {
    this.anonymous = !this.anonymous;
    this.user.anonymous = this.anonymous;
    this.userService.updateInfo(this.user, this.auth);
  }

  remove(evt) {
    this.reviewService.remove(evt);
  }

  update(evt) {
    this.reviewService.update(evt);
  }

  clear() {
    this.localStorageService.clear();
    this.router.navigate(['login']);
  }
}
