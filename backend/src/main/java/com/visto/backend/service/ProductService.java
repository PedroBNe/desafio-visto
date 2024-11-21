package com.visto.backend.service;

import com.visto.backend.entity.Product;
import com.visto.backend.exception.ResourceNotFoundException;
import com.visto.backend.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Page<Product> findAll(String name, Pageable pageable) {
        if (name != null && !name.isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(name, pageable);
        }
        return productRepository.findAll(pageable);
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com id: " + id + " não encontrado"));
    }

    public Product save(Product product) {
        boolean exists = productRepository.existsByNameIgnoreCase(product.getName());
        if (exists) {
            throw new IllegalArgumentException("Já existe um produto com o nome: " + product.getName());
        }

        if (product.getPrice() <= 0) {
            throw new IllegalArgumentException("O preço do produto deve ser maior que zero.");
        }

        return productRepository.save(product);
    }

    public Product update(Long id, Product product) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com id: " + id + " não encontrado"));

        boolean nameConflict = productRepository.existsByNameIgnoreCase(product.getName()) &&
                !existingProduct.getName().equalsIgnoreCase(product.getName());
        if (nameConflict) {
            throw new IllegalArgumentException("Já existe um produto com o nome: " + product.getName());
        }

        existingProduct.setName(product.getName());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setImage(product.getImage());

        return productRepository.save(existingProduct);
    }

    public void deleteById(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Produto com id: " + id + " não encontrado");
        }
        productRepository.deleteById(id);
    }
}
