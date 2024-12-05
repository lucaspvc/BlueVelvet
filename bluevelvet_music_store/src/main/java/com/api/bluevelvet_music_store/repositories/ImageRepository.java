package com.api.bluevelvet_music_store.repositories;

import com.api.bluevelvet_music_store.models.ImageModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<ImageModel,Long> {
}
