package com.api.bluevelvet_music_store.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.DynamicUpdate;

import java.io.Serializable;
import java.util.Base64;

@Entity
@DynamicUpdate
@Table(name = "TB_IMAGENS")
public class ImageModel implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Lob
    @Column(columnDefinition = "MEDIUMBLOB")
    private byte[] image;
    private String contentType;

    @ManyToOne
    @JoinColumn(name = "produto_id", referencedColumnName = "idProduct")
    @JsonIgnore
    private ProductModel produto;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getImages() {
        return ( this.contentType + ";base64," + Base64.getEncoder()
                .encodeToString(this.image) );
    }

    public void setImages(String image) {
        String[] imgSliced = image.split(",");
        this.contentType = imgSliced[0].split(";")[0];
        this.image = Base64.getDecoder().decode(imgSliced[1]);
    }

    public ProductModel getProduto() {
        return produto;
    }

    public void setProduto(ProductModel produto) {
        this.produto = produto;
    }
}
