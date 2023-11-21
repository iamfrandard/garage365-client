import { Component } from '@angular/core';
import { Search } from 'src/app/models/search.model';
import { SearchServiceComponent } from 'src/app/services/search.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  tutorials?: Search[];
  workshops: Search[] = [];
  currentTutorial: Search = {};
  currentIndex = -1;
  brands: any[] = [];
  addresses: string[] = [];
  selectedBrand: string = '';
  selectedAddress: string = '';
  errorMessage: string = '';
  searchValue: string = '';

  noResults: boolean = false;
  loading = false;

  totalWorkshops = 0;
  workshopsPerPage = 4;
  currentPage = 1;
  totalPages = 0;

  constructor(
    private tutorialService: SearchServiceComponent,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.retrieveTutorials();
    this.getWorkshops();
    this.loadBrands();
    this.loadAddresses();
    this.loadUserInfo();
    this.applyFilters();
  }

  loadUserInfo(): void {
    this.authService.getUserInfo().subscribe({
      next: (data) => {
        this.brands = data.brands;
        this.addresses = data.addresses;
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  getWorkshops(page: number = 1): void {
    this.loading = true;
    this.errorMessage = '';
    this.tutorialService
      .getAll(page, this.selectedBrand, this.selectedAddress)
      .subscribe(
        (data: Search[]) => {
          this.workshops = data;
          if (data.length === 0) {
            this.errorMessage =
              'No existen Talleres con los criterios proporcionados!';
          }
          this.totalWorkshops = data.length;
          this.totalPages = Math.ceil(
            this.totalWorkshops / this.workshopsPerPage
          );
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          this.errorMessage =
            'Error al cargar los talleres. Por favor, inténtelo de nuevo más tarde';
        }
      );
  }

  retrieveTutorials(): void {
    this.tutorialService.getAll().subscribe({
      next: (data) => {
        this.tutorials = data;
      },
      error: (e) => console.error(e),
    });
  }

  refreshList(): void {
    this.retrieveTutorials();
    this.currentTutorial = {};
    this.currentIndex = -1;
  }

  setActiveTutorial(tutorial: Search, index: number): void {
    this.currentTutorial = tutorial;
    this.currentIndex = index;
  }

  removeAllTutorials(): void {
    this.tutorialService.deleteAll().subscribe({
      next: (res) => {
        this.refreshList();
      },
      error: (e) => console.error(e),
    });
  }

  search(value: string): void {
    this.noResults = false;
    this.errorMessage = '';
    this.currentTutorial = {};
    this.currentIndex = -1;
    this.selectedBrand = '';
    this.selectedAddress = '';
    if (value.trim() === '') {
      this.getWorkshops();
      return;
    }
    this.tutorialService
      .findByValue(value, this.selectedBrand, this.selectedAddress)
      .subscribe({
        next: (data) => {
          this.tutorials = data;
          this.workshops = data;
          if (data.length === 0) {
            this.noResults = true;
          }
        },
        error: (e) => console.error(e),
      });
  }

  applyFilters(): void {
    this.getWorkshops(this.currentPage);
  }

  onBrandSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.errorMessage = '';
    this.noResults = false;
    this.searchValue = '';
    this.selectedAddress = '';
    if (selectElement) {
      this.selectedBrand = selectElement.value;
      this.applyFilters();
    }
  }

  onAddressSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.errorMessage = '';
    this.noResults = false;
    this.searchValue = '';
    this.selectedBrand = '';
    if (selectElement) {
      this.selectedAddress = selectElement.value;
      this.applyFilters();
    }
  }

  loadBrands(): void {
    this.tutorialService.getAllBrands().subscribe({
      next: (data) => {
        this.brands = data;
      },
      error: (e) => console.error(e),
    });
  }

  loadAddresses(): void {
    this.tutorialService.getAllAddresses().subscribe({
      next: (data) => {
        this.addresses = data;
      },
      error: (e) => console.error(e),
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getWorkshops(this.currentPage);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getWorkshops(this.currentPage);
    }
  }
}
