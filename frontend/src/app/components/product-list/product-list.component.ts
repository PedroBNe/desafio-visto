import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material.modules';
import { Observable, tap } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, MaterialModule, CurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  providers: [ProductService],
})
export class ProductListComponent {
  products$!: Observable<any>;
  totalElements = 0;
  currentPage = 0;
  pageSize = 10;

  constructor(
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.fetchProducts();
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value || '';
    this.fetchProducts(value);
  }

  fetchProducts(name?: string): void {
    this.products$ = this.productService
      .getProducts(name || '', this.currentPage, this.pageSize)
      .pipe(
        tap((response) => {
          this.totalElements = response.totalElements;
          if (this.currentPage === 0) {
            console.log('Primeira página carregada.');
          }
          if (response.last) {
            console.log('Última página carregada.');
          }
        })
      );
  }

  onPageChange(event: PageEvent): void {
    console.log('Nova página:', event.pageIndex);
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchProducts();
  }

  nextPage(): void {
    this.currentPage++;
    this.fetchProducts();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetchProducts();
    }
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.snackBar.open('Produto excluído com sucesso!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.fetchProducts();
      },
      error: () => {
        this.snackBar.open('Erro ao excluir o produto.', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }
  editProduct(id: number): void {
    this.router.navigate([`/produtos/${id}`]);
  }

  createProduct(): void {
    this.router.navigate(['/produtos/new']);
  }
}
