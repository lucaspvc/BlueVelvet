package com.api.bluevelvet_music_store.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.Objects;

public final class DimensionsDto {
    private final BigDecimal length;
    private final BigDecimal width;
    private final  BigDecimal height;
    private final  BigDecimal weight;
    private final  String unit;
    private final  String unitWeight;

    public DimensionsDto(
            BigDecimal length,
            BigDecimal width,
            BigDecimal height,
            BigDecimal weight,
            String unit,
            String unitWeight
    ) {
        this.length = length;
        this.width = width;
        this.height = height;
        this.weight = weight;
        this.unit = unit;
        this.unitWeight = unitWeight;
    }

    public BigDecimal length() {
        return length;
    }

    public BigDecimal width() {
        return width;
    }

    public @NotNull BigDecimal height() {
        return height;
    }

    public @NotNull BigDecimal weight() {
        return weight;
    }

    public @NotBlank String unit() {
        return unit;
    }

    public @NotBlank String unitWeight() {
        return unitWeight;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) return true;
        if (obj == null || obj.getClass() != this.getClass()) return false;
        var that = (DimensionsDto) obj;
        return Objects.equals(this.length, that.length) &&
                Objects.equals(this.width, that.width) &&
                Objects.equals(this.height, that.height) &&
                Objects.equals(this.weight, that.weight) &&
                Objects.equals(this.unit, that.unit) &&
                Objects.equals(this.unitWeight, that.unitWeight);
    }

    @Override
    public int hashCode() {
        return Objects.hash(length, width, height, weight, unit, unitWeight);
    }

    @Override
    public String toString() {
        return "DimensionsDto[" +
                "length=" + length + ", " +
                "width=" + width + ", " +
                "height=" + height + ", " +
                "weight=" + weight + ", " +
                "unit=" + unit + ", " +
                "unitWeight=" + unitWeight + ']';
    }

}
