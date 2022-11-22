package com.mylittlecompta.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mylittlecompta.domain.enumeration.RelationType;
import java.io.Serializable;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Contacts.
 */
@Document(collection = "contacts")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Contacts implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("first_name")
    private String firstName;

    @Field("last_name")
    private String lastName;

    @Field("phone_number")
    private String phoneNumber;

    @Field("address")
    private String address;

    @Field("relation_type")
    private RelationType relationType;

    @DBRef
    private Factures factures;

    @DBRef
    @Field("patients")
    @JsonIgnoreProperties(value = { "contacts", "seances" }, allowSetters = true)
    private Patients patients;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Contacts id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public Contacts firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Contacts lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public Contacts phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return this.address;
    }

    public Contacts address(String address) {
        this.setAddress(address);
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public RelationType getRelationType() {
        return this.relationType;
    }

    public Contacts relationType(RelationType relationType) {
        this.setRelationType(relationType);
        return this;
    }

    public void setRelationType(RelationType relationType) {
        this.relationType = relationType;
    }

    public Factures getFactures() {
        return this.factures;
    }

    public void setFactures(Factures factures) {
        if (this.factures != null) {
            this.factures.setContacts(null);
        }
        if (factures != null) {
            factures.setContacts(this);
        }
        this.factures = factures;
    }

    public Contacts factures(Factures factures) {
        this.setFactures(factures);
        return this;
    }

    public Patients getPatients() {
        return this.patients;
    }

    public void setPatients(Patients patients) {
        this.patients = patients;
    }

    public Contacts patients(Patients patients) {
        this.setPatients(patients);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Contacts)) {
            return false;
        }
        return id != null && id.equals(((Contacts) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Contacts{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", address='" + getAddress() + "'" +
            ", relationType='" + getRelationType() + "'" +
            "}";
    }
}
