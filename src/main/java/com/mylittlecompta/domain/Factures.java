package com.mylittlecompta.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Factures.
 */
@Document(collection = "factures")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Factures implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("number")
    private String number;

    @Field("emission_date")
    private ZonedDateTime emissionDate;

    @Field("paid_invoice")
    private Boolean paidInvoice;

    @DBRef
    @Field("contacts")
    private Contacts contacts;

    @DBRef
    @Field("seances")
    @JsonIgnoreProperties(value = { "prestations", "patients", "factures" }, allowSetters = true)
    private Set<Seances> seances = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Factures id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNumber() {
        return this.number;
    }

    public Factures number(String number) {
        this.setNumber(number);
        return this;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public ZonedDateTime getEmissionDate() {
        return this.emissionDate;
    }

    public Factures emissionDate(ZonedDateTime emissionDate) {
        this.setEmissionDate(emissionDate);
        return this;
    }

    public void setEmissionDate(ZonedDateTime emissionDate) {
        this.emissionDate = emissionDate;
    }

    public Boolean getPaidInvoice() {
        return this.paidInvoice;
    }

    public Factures paidInvoice(Boolean paidInvoice) {
        this.setPaidInvoice(paidInvoice);
        return this;
    }

    public void setPaidInvoice(Boolean paidInvoice) {
        this.paidInvoice = paidInvoice;
    }

    public Contacts getContacts() {
        return this.contacts;
    }

    public void setContacts(Contacts contacts) {
        this.contacts = contacts;
    }

    public Factures contacts(Contacts contacts) {
        this.setContacts(contacts);
        return this;
    }

    public Set<Seances> getSeances() {
        return this.seances;
    }

    public void setSeances(Set<Seances> seances) {
        if (this.seances != null) {
            this.seances.forEach(i -> i.setFactures(null));
        }
        if (seances != null) {
            seances.forEach(i -> i.setFactures(this));
        }
        this.seances = seances;
    }

    public Factures seances(Set<Seances> seances) {
        this.setSeances(seances);
        return this;
    }

    public Factures addSeances(Seances seances) {
        this.seances.add(seances);
        seances.setFactures(this);
        return this;
    }

    public Factures removeSeances(Seances seances) {
        this.seances.remove(seances);
        seances.setFactures(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Factures)) {
            return false;
        }
        return id != null && id.equals(((Factures) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Factures{" +
            "id=" + getId() +
            ", number='" + getNumber() + "'" +
            ", emissionDate='" + getEmissionDate() + "'" +
            ", paidInvoice='" + getPaidInvoice() + "'" +
            "}";
    }
}
