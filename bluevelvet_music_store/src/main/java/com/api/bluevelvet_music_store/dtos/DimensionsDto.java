package com.api.bluevelvet_music_store.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record DimensionsDto(
        BigDecimal length,
        BigDecimal width,
        BigDecimal height,
        BigDecimal weight,
        String unit,
        String unitWeight
) {
}
