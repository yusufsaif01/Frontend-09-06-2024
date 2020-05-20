import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TimelineComponent } from './timeline.component';
import { PostPopupComponent } from './post-popup/post-popup.component';
import { TimelineRoutingModule } from './timeline-routing.module';

@NgModule({
  declarations: [TimelineComponent, PostPopupComponent],
  imports: [CommonModule, TimelineRoutingModule, SharedModule, CarouselModule],
  entryComponents: [PostPopupComponent]
})
export class TimelineModule {}