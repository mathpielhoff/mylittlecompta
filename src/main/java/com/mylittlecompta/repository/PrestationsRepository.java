package com.mylittlecompta.repository;

import com.mylittlecompta.domain.Prestations;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Prestations entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PrestationsRepository extends MongoRepository<Prestations, String> {}
