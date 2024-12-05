package com.api.bluevelvet_music_store.controllers;

import com.api.bluevelvet_music_store.dtos.ProductDto;
import com.api.bluevelvet_music_store.models.ProductModel;
import com.api.bluevelvet_music_store.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/produtos")
public class ProductController {

    final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<Object> saveProdutos(@RequestBody @Valid ProductDto productDto){
        if(productService.existsByProductName(productDto.productName())){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Conflito: o nome desse produto já está em uso!");
        }
        var produtoModel = new ProductModel();
        produtoModel = productService.copyProperties(productDto,produtoModel);
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.save(produtoModel));
    }

    @GetMapping
    public ResponseEntity<Page<ProductModel>> getAllProdutos(@PageableDefault(sort = "idProduct", direction = Sort.Direction.ASC)
                                                             Pageable pageable){
        return ResponseEntity.status(HttpStatus.OK).body(productService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getOneProduto(@PathVariable(value = "id") Long id){
        Optional<ProductModel> produtoModelOpt = productService.findById(id);
        if(produtoModelOpt.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produto não encontrado.");
        }
        return ResponseEntity.status(HttpStatus.OK).body(produtoModelOpt.get());
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductModel>> getProdutosByParam(@RequestParam String name,
                                                                 @PageableDefault(sort = "idProduct", direction = Sort.Direction.ASC)
                                                                 Pageable pageable){
        Page<ProductModel> produtoModels = productService.searchProdutos(name,pageable);
        if(produtoModels.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(produtoModels);
        }
        return ResponseEntity.status(HttpStatus.OK).body(produtoModels);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateProduto(@PathVariable(value = "id") Long id,
                                                @RequestBody @Valid ProductDto productDto){
        Optional<ProductModel> produtoModelOpt = productService.findById(id);
        if(produtoModelOpt.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produto não encontrado.");
        }
        var produtoModel = new ProductModel();
        produtoModel = productService.copyProperties(productDto,produtoModelOpt.get());
        produtoModel.setIdProduct(produtoModelOpt.get().getIdProduct());
        produtoModel.setCreatedAt(produtoModelOpt.get().getCreatedAt());
        return ResponseEntity.status(HttpStatus.OK).body(productService.save(produtoModel));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteProduto(@PathVariable(value = "id") Long id){
        Optional<ProductModel> produtoModelOpt = productService.findById(id);
        if(produtoModelOpt.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produto não encontrado.");
        }
        productService.delete(produtoModelOpt.get());
        return ResponseEntity.status(HttpStatus.OK).body("Produto deletado com sucesso.");
    }

}