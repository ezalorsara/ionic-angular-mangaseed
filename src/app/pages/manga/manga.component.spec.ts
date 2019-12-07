import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MangaComponent } from './manga.component';

describe('MangaComponent', () => {
  let component: MangaComponent;
  let fixture: ComponentFixture<MangaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MangaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MangaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
