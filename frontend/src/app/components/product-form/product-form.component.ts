import { ChangeDetectorRef, Component } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { MaterialModule } from '../../material.modules';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product } from '../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, switchMap, tap } from 'rxjs';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, NgIf, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  providers: [ProductService],
})
export class ProductFormComponent {
  productForm!: FormGroup;
  product$!: Observable<Product | null>;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });

    this.product$ = this.route.params.pipe(
      switchMap((params) => {
        if (params['id'] && params['id'] !== 'new') {
          this.isEditMode = true;
          this.cdr.detectChanges();
          return this.productService.getProductById(+params['id']).pipe(
            tap((product) => {
              if (product) {
                this.productForm.patchValue(product);
                this.productForm.addControl('id', this.fb.control(product.id));
              }
            })
          );
        } else {
          this.isEditMode = false;
          this.cdr.detectChanges();
          return of(null);
        }
      })
    );
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.snackBar.open(
        'Por favor, preencha todos os campos corretamente.',
        'Fechar',
        {
          duration: 3000,
        }
      );
      return;
    }

    const product: Product = this.productForm.value;

    if (this.isEditMode) {
      this.productService.updateProduct(product.id!, product).subscribe(() => {
        this.snackBar.open('Produto atualizado com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.router.navigate(['/produtos']);
      });
    } else {
      this.productService.createProduct(product).subscribe(() => {
        this.snackBar.open('Produto criado com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.router.navigate(['/produtos']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/produtos']);
  }
}
