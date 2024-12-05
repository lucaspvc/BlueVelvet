package com.api.bluevelvet_music_store.dtos;

import jakarta.validation.constraints.NotBlank;

public record DetailsDto(
        @NotBlank
        String name,
        @NotBlank
        String value
) {
}
