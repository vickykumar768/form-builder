import { Component, Input } from '@angular/core';
import { CommonModule }     from '@angular/common';
import { FormSubmission }   from '@core/models';

@Component({
  selector:    'fc-submission-summary',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './submission-summary.component.html',
})
export class SubmissionSummaryComponent {
  @Input() submission: FormSubmission | null = null;

  get entries(): { key: string; value: string }[] {
    if (!this.submission) return [];
    return Object.entries(this.submission.data).map(([key, value]) => ({ key, value }));
  }
  get timestamp(): string {
    return this.submission?.submittedAt.toLocaleString() ?? '';
  }
}
