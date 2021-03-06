import { Component, Directive, Input } from '@angular/core';
import { FormControlDirective } from '@angular/forms';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { MockDirective } from './mock_directive';

@Directive({
  exportAs: 'foo',
  selector: '[exampleDirective]'
})
export class ExampleDirective {
  @Input() exampleDirective: string;
  @Input('bah') something: string;
}

@Component({
  selector: 'example-component-container',
  template: `
    <div [exampleDirective]="'bye'" [bah]="'hi'" #f="foo"></div>
    <div exampleDirective></div>
  `
})
export class ExampleComponentContainer {}

describe('MockComponent', () => {
  let fixture: ComponentFixture<ExampleComponentContainer>;

  getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExampleComponentContainer,
        MockDirective(ExampleDirective)
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleComponentContainer);
    fixture.detectChanges();
  });

  it('should have use the original component\'s selector', () => {
    const element = fixture.debugElement.query(By.directive(MockDirective(ExampleDirective)));
    expect(element).not.toBeNull();
  });

  it('should have the input set on the mock component', () => {
    const debugElement = fixture.debugElement.query(By.directive(MockDirective(ExampleDirective)));
    const element = debugElement.injector.get(MockDirective(ExampleDirective));
    expect(element.something).toEqual('hi');
    expect(element.exampleDirective).toEqual('bye');
  });

  it('should memoize the return value by argument', () => {
    expect(MockDirective(ExampleDirective)).toEqual(MockDirective(ExampleDirective));
    expect(MockDirective(ExampleDirective)).not.toEqual(ExampleDirective);
  });

  it('can mock formControlDirective from angular', () => {
    // Some angular directives set up their metadata in a different way than @Directive does
    // I found that FormControlDirective is one of those weird directives.
    // Since I don't know how they did it, I don't know how to test it except to write this
    // test around a known-odd directive.
    expect(() => {
      MockDirective(FormControlDirective);
    }).not.toThrow();
  });
});
