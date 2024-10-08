import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TitleService } from './title.service';


@Component({
  template: ''
})
export class MockComponent { }

const route = [
  {
    path: '', component: MockComponent,
    children: [
      {
        path: 'parent1', component: MockComponent,
        data: {
          title: 'Parent 1 Title'
        },
        children: [
          {
            path: 'child1', component: MockComponent,
            data: {
              title: 'Child 1 Title'
            }
          },
          {
            path: 'child2', component: MockComponent,
            data: {
              title: 'Child 2 Title'
            }
          }
        ]
      },
      {
        path: 'parent2', component: MockComponent,
        data: {
          title: 'Parent 2 Title'
        },
        children: [
          {
            path: 'child3', component: MockComponent
          },
          {
            path: 'child4', component: MockComponent
          }
        ]
      },
      {
        path: 'parent3', component: MockComponent,
        children: [
          {
            path: 'child5', component: MockComponent
          },
          {
            path: 'child6', component: MockComponent
          }
        ]
      }
    ]
  }
];

describe('TitleService', () => {
  let service: TitleService;
  let fixture: ComponentFixture<MockComponent>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(route)
      ],
      declarations: [
        MockComponent
      ],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(MockComponent);
    service = TestBed.inject(TitleService);
  });

  it('should be created', () => {
    const titleService: TitleService = TestBed.inject(TitleService);
    expect(titleService).toBeTruthy();
  });

  it('should set default title value on init', () => {
    const titleService: TitleService = TestBed.inject(TitleService);
    service.init('Default Title');
    expect(titleService.defaultTitle).toBe('Default Title');
  });

});
