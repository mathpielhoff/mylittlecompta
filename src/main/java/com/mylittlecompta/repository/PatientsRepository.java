package com.mylittlecompta.repository;

import com.mylittlecompta.domain.Patients;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Patients entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PatientsRepository extends MongoRepository<Patients, String> {}
