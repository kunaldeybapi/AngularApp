import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { AddTaskComponent } from './add-task.component';
import { DebugElement } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('AddTaskComponent', () => {
  let comp: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTaskComponent ],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaskComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it(`form should be invalid`, async(() => {
  //   comp.addForm.get['Task1'].setValue('');    
  //   comp.addForm.get['Parent_ID'].setValue('');
  //   comp.addForm.get['Start_Date'].setValue('');
  //   comp.addForm.get['End_Date'].setValue('');
  //   expect(comp.addForm.valid).toBeFalsy();
  // }));

  // it('should create', () => {
  //   expect(comp).toBeTruthy();
  // });
});
