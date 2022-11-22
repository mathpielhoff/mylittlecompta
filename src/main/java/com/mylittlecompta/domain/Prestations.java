package com.mylittlecompta.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Duration;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Prestations.
 */
@Document(collection = "prestations")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Prestations implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("label")
    private String label;

    @Field("minutes_duration")
    private Duration minutesDuration;

    @Field("price")
    private Float price;

    @DBRef
    private Seances seances;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Prestations id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLabel() {
        return this.label;
    }

    public Prestations label(String label) {
        this.setLabel(label);
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Duration getMinutesDuration() {
        return this.minutesDuration;
    }

    public Prestations minutesDuration(Duration minutesDuration) {
        this.setMinutesDuration(minutesDuration);
        return this;
    }

    public void setMinutesDuration(Duration minutesDuration) {
        this.minutesDuration = minutesDuration;
    }

    public Float getPrice() {
        return this.price;
    }

    public Prestations price(Float price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public Seances getSeances() {
        return this.seances;
    }

    public void setSeances(Seances seances) {
        if (this.seances != null) {
            this.seances.setPrestations(null);
        }
        if (seances != null) {
            seances.setPrestations(this);
        }
        this.seances = seances;
    }

    public Prestations seances(Seances seances) {
        this.setSeances(seances);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Prestations)) {
            return false;
        }
        return id != null && id.equals(((Prestations) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Prestations{" +
            "id=" + getId() +
            ", label='" + getLabel() + "'" +
            ", minutesDuration='" + getMinutesDuration() + "'" +
            ", price=" + getPrice() +
            "}";
    }
}
