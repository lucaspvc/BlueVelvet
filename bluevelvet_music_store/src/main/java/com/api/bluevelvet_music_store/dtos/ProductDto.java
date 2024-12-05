package com.api.bluevelvet_music_store.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record ProductDto(
        @NotBlank
        String productName,
        @NotBlank
        String shortDescription,
        @NotBlank
        String fullDescription,
        @NotBlank
        String brand,
        @NotBlank
        String category,
        @NotBlank
        String mainImage,
        @Valid
        List<ImageDto> featuredImages,
        @NotNull
        BigDecimal price,
        @NotNull
        BigDecimal discount,
        @NotNull
        boolean enabled,
        @NotNull
        boolean inStock,
        @Valid
        @NotNull
        DimensionsDto dimensions,
        @Valid
        List<DetailsDto> details
) {
}