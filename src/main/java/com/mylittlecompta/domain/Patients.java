package com.mylittlecompta.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Patients.
 */
@Document(collection = "patients")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Patients implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("first_name")
    private String firstName;

    @Field("last_name")
    private String lastName;

    @Field("age")
    private String age;

    @Field("school_class")
    private String schoolClass;

    @Field("school")
    private String school;

    @DBRef
    @Field("contacts")
    @JsonIgnoreProperties(value = { "factures", "patients" }, allowSetters = true)
    private Set<Contacts> contacts = new HashSet<>();

    @DBRef
    @Field("seances")
    @JsonIgnoreProperties(value = { "prestations", "patients", "factures" }, allowSetters = true)
    private Set<Seances> seances = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Patients id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public Patients firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Patients lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getAge() {
        return this.age;
    }

    public Patients age(String age) {
        this.setAge(age);
        return this;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public String getSchoolClass() {
        return this.schoolClass;
    }

    public Patients schoolClass(String schoolClass) {
        this.setSchoolClass(schoolClass);
        return this;
    }

    public void setSchoolClass(String schoolClass) {
        this.schoolClass = schoolClass;
    }

    public String getSchool() {
        return this.school;
    }

    public Patients school(String school) {
        this.setSchool(school);
        return this;
    }

    public void setSchool(String school) {
        this.school = school;
    }

    public Set<Contacts> getContacts() {
        return this.contacts;
    }

    public void setContacts(Set<Contacts> contacts) {
        if (this.contacts != null) {
            this.contacts.forEach(i -> i.setPatients(null));
        }
        if (contacts != null) {
            contacts.forEach(i -> i.setPatients(this));
        }
        this.contacts = contacts;
    }

    public Patients contacts(Set<Contacts> contacts) {
        this.setContacts(contacts);
        return this;
    }

    public Patients addContacts(Contacts contacts) {
        this.contacts.add(contacts);
        contacts.setPatients(this);
        return this;
    }

    public Patients removeContacts(Contacts contacts) {
        this.contacts.remove(contacts);
        contacts.setPatients(null);
        return this;
    }

    public Set<Seances> getSeances() {
        return this.seances;
    }

    public void setSeances(Set<Seances> seances) {
        if (this.seances != null) {
            this.seances.forEach(i -> i.setPatients(null));
        }
        if (seances != null) {
            seances.forEach(i -> i.setPatients(this));
        }
        this.seances = seances;
    }

    public Patients seances(Set<Seances> seances) {
        this.setSeances(seances);
        return this;
    }

    public Patients addSeances(Seances seances) {
        this.seances.add(seances);
        seances.setPatients(this);
        return this;
    }

    public Patients removeSeances(Seances seances) {
        this.seances.remove(seances);
        seances.setPatients(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Patients)) {
            return false;
        }
        return id != null && id.equals(((Patients) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Patients{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", age='" + getAge() + "'" +
            ", schoolClass='" + getSchoolClass() + "'" +
            ", school='" + getSchool() + "'" +
            "}";
    }
}
