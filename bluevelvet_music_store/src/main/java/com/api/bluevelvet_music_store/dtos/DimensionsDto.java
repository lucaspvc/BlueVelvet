package com.api.bluevelvet_music_store.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record DimensionsDto(
        @NotNull
        BigDecimal length,
        @NotNull
        BigDecimal width,
        @NotNull
        BigDecimal height,
        @NotNull
        BigDecimal weight,
        @NotBlank
        String unit,
        @NotBlank
        String unitWeight
) {
}
