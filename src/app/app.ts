import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  styleUrls: ['app.css'],
  template: `
    <div class="page">
      <div class="card">
        <h2>Time Calculator</h2>
        <div class="form-grid">
          <label class="field" for="start1">
            <span>Start1</span>
            <input id="start1" type="time" [(ngModel)]="start1"/>
          </label>
          <label class="field" for="end1">
            <span>End1</span>
            <input id="end1" type="time" [(ngModel)]="end1"/>
          </label>
          <label class="field" for="start2">
            <span>Start2</span>
            <input id="start2" type="time" [(ngModel)]="start2"/>
          </label>
          <label class="field" for="end2">
            <span>End2</span>
            <input id="end2" type="time" [(ngModel)]="end2"/>
          </label>
        </div>
        <button class="primary" (click)="calculate()">Calculate Total Time</button>
        <div class="results">
          <div class="result-row">
            <span>Total Time</span>
            <strong>{{ totalTime }}</strong>
          </div>
          <div class="result-row">
            <span>End Time with 9h</span>
            <strong>{{ endTime9 }}</strong>
          </div>
          <div class="result-row">
            <span>End Time with 8h 24 min</span>
            <strong>{{ endTime8 }}</strong>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [FormsModule]
})

export class App {
  start1: string = '';
  end1: string = '';
  start2: string = '';
  end2: string = '';
  totalTime: string = '';
  endTime9: string = '';
  endTime8: string = '';

  calculate() {
    const breakAdjustment = this.getBreakAdjustment(this.end1, this.start2);
    if (breakAdjustment === null) {
      return;
    }

    if (!this.start2 || this.start2 === '') {
      this.totalTime = this.formatTime(this.getMinutes(this.start1, this.end1));
      this.endTime9 = '';
      this.endTime8 = '';
    } else  {
      const zeit1 = this.getMinutes(this.start1, this.end1);
      const totalMinutes = zeit1 + this.getMinutes(this.start2, this.end2) - breakAdjustment;
      this.totalTime = this.formatTime(totalMinutes);
      this.calculateEndTimes(zeit1, this.start2, breakAdjustment);
    }
  }

  private getMinutes(start: string, end: string): number {
    if (!start || !end) return 0;
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    return (eh * 60 + em) - (sh * 60 + sm);
  }

  private formatTime(minutes: number): string {
    if (isNaN(minutes) || minutes < 0) return '0 hours and 0 minutes';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} hours and ${mins} minutes`;
  }

  private calculateEndTimes(totalMinutes: number, startTime: string, breakAdjustment: number) {
    if (!startTime) {
      this.endTime9 = '';
      this.endTime8 = '';
      return;
    }
    const [sh, sm] = startTime.split(":").map(Number);
    const startMinutes = sh * 60 + sm;
    const endMinutes9 = startMinutes + (540 - totalMinutes) + breakAdjustment;
    const endMinutes8 = startMinutes + (504 - totalMinutes) + breakAdjustment;
    this.endTime9 = this.formatToTime(endMinutes9);
    this.endTime8 = this.formatToTime(endMinutes8);
  }

  private formatToTime(totalMinutes: number): string {
    let h = Math.floor(totalMinutes / 60) % 24;
    let m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  private getBreakAdjustment(end1: string, start2: string): number | null {
    if (!end1 || !start2) return 0;
    const end1Minutes = this.getMinutes('00:00', end1);
    const start2Minutes = this.getMinutes('00:00', start2);
    const difference = start2Minutes - end1Minutes;
    if (difference <= 0) {
      this.totalTime = 'Start2 muss nach End1 liegen!';
      this.endTime9 = '';
      this.endTime8 = '';
      return null;
    }
    if (difference < 30) {
      return 30 - difference;
    }
    return 0;
  }
}
