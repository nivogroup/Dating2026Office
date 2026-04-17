import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Member } from '../../../types/member';
import { AgePipe } from '../../../core/pipes/age-pipe';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css',
})
export class MemberDetailed implements OnInit {
  //private memberService = inject(MemberService); Not required now
  private route = inject(ActivatedRoute);
  private router = inject(Router) // This is for to get the title in the righthand side
  protected member = signal<Member | undefined>(undefined); // The observable turned into signal
  protected title = signal<string | undefined>('Profile'); // This is for to get the title in the righthand side

  // We might have used constructor also as per the last example
  ngOnInit(): void {
    //this.member$ = this.loadMember();
    this.route.data.subscribe({
      next: data => this.member.set(data['member'])
    })

    this.title.set(this.route.firstChild?.snapshot?.title); // This will fetch the title

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({
      next: () => {
        this.title.set(this.route.firstChild?.snapshot?.title)
      }
    })
  }
  // Not required as we have used the resolver to get the data
  /* loadMember() {
    const id = this.route.snapshot.paramMap.get('id');
    if(!id) return;
    return this.memberService.getMember(id);
  } */

}
