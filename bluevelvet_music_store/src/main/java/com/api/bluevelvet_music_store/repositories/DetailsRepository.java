package com.api.bluevelvet_music_store.repositories;

import com.api.bluevelvet_music_store.models.DetailsModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetailsRepository extends JpaRepository<DetailsModel,Long> {
}
