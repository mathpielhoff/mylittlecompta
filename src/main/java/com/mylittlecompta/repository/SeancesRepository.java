package com.mylittlecompta.repository;

import com.mylittlecompta.domain.Seances;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Seances entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SeancesRepository extends MongoRepository<Seances, String> {}
