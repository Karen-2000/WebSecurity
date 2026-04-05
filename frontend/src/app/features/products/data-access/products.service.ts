import { Injectable } from '@angular/core';
import { supabase } from '../../../core/config/supabase.client';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }

    return (data ?? []) as Product[];
  }
}
