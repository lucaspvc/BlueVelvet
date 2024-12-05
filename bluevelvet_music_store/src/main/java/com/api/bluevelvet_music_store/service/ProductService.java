
package com.api.bluevelvet_music_store.service;

import com.api.bluevelvet_music_store.dtos.ProductDto;
import com.api.bluevelvet_music_store.models.DetailsModel;
import com.api.bluevelvet_music_store.models.DimensionsModel;
import com.api.bluevelvet_music_store.models.ImageModel;
import com.api.bluevelvet_music_store.models.ProductModel;
import com.api.bluevelvet_music_store.repositories.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional
    public ProductModel save(ProductModel productModel) {
        return productRepository.save(productModel);
    }

    public boolean existsByProductName(String name){
        return productRepository.existsByProductName(name);
    }

    public Page<ProductModel> findAll(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public Optional<ProductModel> findById(Long id){
        return productRepository.findById(id);
    }

    public Page<ProductModel> searchProdutos(String name, Pageable pageable){
        return productRepository.searchProdutos(name,pageable);
    }

    @Transactional
    public void delete(ProductModel productModel) {
        productRepository.delete(productModel);
    }

    public ProductModel copyProperties(ProductDto productDto, ProductModel productModel){

        BeanUtils.copyProperties(productDto, productModel,"dimensions",
                "mainImage","featuredImages","details");
        productModel.setMainImage(productDto.mainImage());

        DimensionsModel dimensions;
        if (productModel.getDimensions() != null){
            dimensions = productModel.getDimensions();
            BeanUtils.copyProperties(productDto.dimensions(), dimensions);
        }else {
            dimensions = new DimensionsModel();
            BeanUtils.copyProperties(productDto.dimensions(), dimensions);
        }

        List<ImageModel> images = new ArrayList<>();
        productDto.featuredImages().forEach(img -> {
            var image = new ImageModel();
            image.setImages(img.image());
            images.add(image);
        });

        List<DetailsModel> details = new ArrayList<>();
        productDto.details().forEach(detailsDto -> {
            var detail = new DetailsModel();
            BeanUtils.copyProperties(detailsDto, detail);
            details.add(detail);
        });

        productModel.setDimensions(dimensions);
        productModel.setFeaturedImages(images);
        productModel.setDetails(details);

        if(!productRepository.existsByIdProduct(productModel.getIdProduct()))
            productModel.setCreatedAt(LocalDateTime.now(ZoneId.of("UTC")));
        productModel.setUpdateAt(LocalDateTime.now(ZoneId.of("UTC")));

        return productModel;
    }


}
