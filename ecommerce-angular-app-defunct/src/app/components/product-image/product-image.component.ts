import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trace, Span } from '@opentelemetry/api';

const tracer = trace.getTracer('product-image');

@Component({
  selector: 'app-product-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img
      [src]="imageUrl"
      [alt]="altText"
      (error)="handleImageError()"
      [class]="imageClass"
    />
  `,
  styles: [`
    :host {
      display: block;
    }
    img {
      width: 100%;
      height: auto;
      object-fit: cover;
    }
  `]
})
export class ProductImageComponent {
  @Input() imageUrl!: string;
  @Input() productId!: string;
  @Input() altText: string = 'Product image';
  @Input() imageClass: string = '';

  @Output() imageError = new EventEmitter<void>();

  handleImageError(): void {
    const span = tracer.startSpan('image.load.error');
    try {
      span.setAttribute('error.type', 'missing_image');
      span.setAttribute('error.message', 'Image source is empty');
      span.setAttribute('product.id', this.productId);
      span.setAttribute('url', this.imageUrl);
      span.recordException(new Error('Failed to load product image'));
      span.setStatus({ code: 2, message: 'Image not found' });
    } finally {
      span.end();
    }
    this.imageError.emit();
  }
} 