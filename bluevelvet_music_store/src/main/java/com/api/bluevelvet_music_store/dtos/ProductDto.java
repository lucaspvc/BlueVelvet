package com.api.bluevelvet_music_store.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record ProductDto(
        String productName,

        String shortDescription,

        String fullDescription,

        String brand,

        String category,

        String mainImage,
        List<ImageDto> featuredImages,

        BigDecimal price,

        BigDecimal discount,

        boolean enabled,

        boolean inStock,
        DimensionsDto dimensions,
        List<DetailsDto> details
) {
}