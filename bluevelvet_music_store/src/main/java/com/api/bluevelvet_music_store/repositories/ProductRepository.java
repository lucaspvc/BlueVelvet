package com.api.bluevelvet_music_store.repositories;

import com.api.bluevelvet_music_store.models.ProductModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<ProductModel,Long> {

    boolean existsByIdProduct(long id);

    boolean existsByProductName(String name);

    @Query(
            "SELECT p FROM ProductModel p WHERE " +
                    "LOWER(p.productName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                    "LOWER(p.category) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                    "LOWER(p.shortDescription) LIKE LOWER(CONCAT('%', :searchTerm, '%'))"
    )
    Page<ProductModel> searchProdutos(@Param("searchTerm") String name, Pageable pageable);
}