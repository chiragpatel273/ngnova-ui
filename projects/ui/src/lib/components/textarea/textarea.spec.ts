import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { UiTextareaComponent } from './textarea';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UiTextareaComponent],
  template: `<ui-textarea label="Message" helperText="Keep it short" [formControl]="control" />`,
})
class HostComponent {
  control = new FormControl('Hello');
}

describe('UiTextareaComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('works as a ControlValueAccessor', () => {
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Hello');

    textarea.value = 'Updated';
    textarea.dispatchEvent(new Event('input'));

    expect(fixture.componentInstance.control.value).toBe('Updated');
  });

  it('keeps helper text connected with aria-describedby', () => {
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    const helper = fixture.nativeElement.querySelector('p') as HTMLParagraphElement;

    expect(textarea.getAttribute('aria-describedby')).toBe(helper.id);
  });

  it('applies resize classes', () => {
    const textareaFixture = TestBed.createComponent(UiTextareaComponent);
    textareaFixture.componentRef.setInput('resize', 'none');
    textareaFixture.detectChanges();

    const textarea = textareaFixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;

    expect(textarea.className).toContain('resize-none');
  });
});
