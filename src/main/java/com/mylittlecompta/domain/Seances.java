package com.mylittlecompta.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Seances.
 */
@Document(collection = "seances")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Seances implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("place")
    private String place;

    @Field("date")
    private ZonedDateTime date;

    @DBRef
    @Field("prestations")
    private Prestations prestations;

    @DBRef
    @Field("patients")
    @JsonIgnoreProperties(value = { "contacts", "seances" }, allowSetters = true)
    private Patients patients;

    @DBRef
    @Field("factures")
    @JsonIgnoreProperties(value = { "contacts", "seances" }, allowSetters = true)
    private Factures factures;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Seances id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPlace() {
        return this.place;
    }

    public Seances place(String place) {
        this.setPlace(place);
        return this;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public Seances date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Prestations getPrestations() {
        return this.prestations;
    }

    public void setPrestations(Prestations prestations) {
        this.prestations = prestations;
    }

    public Seances prestations(Prestations prestations) {
        this.setPrestations(prestations);
        return this;
    }

    public Patients getPatients() {
        return this.patients;
    }

    public void setPatients(Patients patients) {
        this.patients = patients;
    }

    public Seances patients(Patients patients) {
        this.setPatients(patients);
        return this;
    }

    public Factures getFactures() {
        return this.factures;
    }

    public void setFactures(Factures factures) {
        this.factures = factures;
    }

    public Seances factures(Factures factures) {
        this.setFactures(factures);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Seances)) {
            return false;
        }
        return id != null && id.equals(((Seances) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Seances{" +
            "id=" + getId() +
            ", place='" + getPlace() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
