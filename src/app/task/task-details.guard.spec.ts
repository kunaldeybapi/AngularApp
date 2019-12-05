import { TestBed, async, inject } from '@angular/core/testing';

import { TaskDetailsGuard } from './task-details.guard';

describe('TaskDetailsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskDetailsGuard]
    });
  });

  it('should ...', inject([TaskDetailsGuard], (guard: TaskDetailsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
