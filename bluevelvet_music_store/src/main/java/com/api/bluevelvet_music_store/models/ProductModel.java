package com.api.bluevelvet_music_store.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Entity
@Table(name = "TB_BLUEVELVET")
public class ProductModel implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idProduct;

    private String productName;
    @Column(length = 100)
    private String shortDescription;
    @Column(length = 500)
    private String fullDescription;
    private String brand;
    private String category;

    @Lob
    @Column(columnDefinition = "MEDIUMBLOB")
    private byte[] mainImage;
    private String contentType;

    @OneToMany(mappedBy = "produto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImageModel> featuredImages = new ArrayList<>();

    private BigDecimal price;
    private BigDecimal discount;
    @Column(columnDefinition = "TINYINT")
    private boolean enabled;
    @Column(columnDefinition = "TINYINT")
    private boolean inStock;

    @OneToOne(mappedBy = "produto", cascade = CascadeType.ALL)
    private DimensionsModel dimensions;

    @OneToMany(mappedBy = "produto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetailsModel> details = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updateAt;

    public long getIdProduct() {
        return idProduct;
    }

    public void setIdProduct(long idProduct) {
        this.idProduct = idProduct;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getFullDescription() {
        return fullDescription;
    }

    public void setFullDescription(String fullDescription) {
        this.fullDescription = fullDescription;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getMainImage() {
        return ( this.contentType + ";base64," + Base64.getEncoder()
                .encodeToString(this.mainImage) );
    }

    public void setMainImage(@NotBlank String mainImage) {
        String[] imgSliced = mainImage.split(",");
        this.contentType = imgSliced[0].split(";")[0];
        this.mainImage = Base64.getDecoder().decode(imgSliced[1]);
    }

    public List<ImageModel> getFeaturedImages() {
        return featuredImages;
    }

    public void setFeaturedImages(List<ImageModel> featuredImages) {
        this.featuredImages.clear();
        this.featuredImages.addAll(featuredImages);
        this.featuredImages.forEach(img -> img.setProduto(this));
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isInStock() {
        return inStock;
    }

    public void setInStock(boolean inStock) {
        this.inStock = inStock;
    }

    public DimensionsModel getDimensions() {
        return dimensions;
    }

    public void setDimensions(@NotNull DimensionsModel dimensions) {
        this.dimensions = dimensions;
        dimensions.setProduto(this);
    }

    public List<DetailsModel> getDetails() {
        return details;
    }

    public void setDetails(List<DetailsModel> details) {
        this.details.clear();
        this.details.addAll(details);
        this.details.forEach(detail -> detail.setProduto(this));
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(LocalDateTime updateAt) {
        this.updateAt = updateAt;
    }
}


