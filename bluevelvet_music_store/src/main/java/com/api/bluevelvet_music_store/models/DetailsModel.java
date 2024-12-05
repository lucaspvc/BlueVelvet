package com.api.bluevelvet_music_store.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "TB_DETALHES")
public class DetailsModel implements Serializable {
    final static long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String value;

    @ManyToOne
    @JoinColumn(name = "id_produto", referencedColumnName = "idProduct")
    @JsonIgnore
    private ProductModel produto;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public ProductModel getProduto() {
        return produto;
    }

    public void setProduto(ProductModel produto) {
        this.produto = produto;
    }
}
