import { Component, Input } from '@angular/core';
import { ScheduleRow, TimeBracket } from '../types';
import { getTextFromTimeBracket } from '../helper-functions';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-week-schedule',
  standalone: true,
  imports: [TableModule, TagModule, CommonModule],
  templateUrl: './week-schedule.component.html',
  styleUrl: './week-schedule.component.scss',
})
export class WeekScheduleComponent {
  @Input() schedule: ScheduleRow[] | any;

  getTextFromTimeBracket(timeBracket: TimeBracket) {
    return getTextFromTimeBracket(timeBracket);
  }
}
