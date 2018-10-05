
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavegacaoComponent } from './navegacao.component';

describe('NavegacaoComponent', () => {
  let component: NavegacaoComponent;
  let fixture: ComponentFixture<NavegacaoComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatSidenavModule],
      declarations: [NavegacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavegacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
