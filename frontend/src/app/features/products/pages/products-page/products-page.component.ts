import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../data-access/products.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss'
})
export class ProductsPageComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  errorMessage = '';

  constructor(private productsService: ProductsService) {}

  async ngOnInit() {
    try {
      this.products = await this.productsService.getProducts();
      console.log('Productos cargados desde Supabase:', this.products);
    } catch (error) {
      console.error(error);
      this.errorMessage = 'No se pudieron cargar los productos desde Supabase.';
    } finally {
      this.loading = false;
    }
  }
}
