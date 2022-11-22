package com.mylittlecompta.web.rest;

import com.mylittlecompta.domain.Prestations;
import com.mylittlecompta.repository.PrestationsRepository;
import com.mylittlecompta.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mylittlecompta.domain.Prestations}.
 */
@RestController
@RequestMapping("/api")
public class PrestationsResource {

    private final Logger log = LoggerFactory.getLogger(PrestationsResource.class);

    private static final String ENTITY_NAME = "prestations";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PrestationsRepository prestationsRepository;

    public PrestationsResource(PrestationsRepository prestationsRepository) {
        this.prestationsRepository = prestationsRepository;
    }

    /**
     * {@code POST  /prestations} : Create a new prestations.
     *
     * @param prestations the prestations to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new prestations, or with status {@code 400 (Bad Request)} if the prestations has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/prestations")
    public ResponseEntity<Prestations> createPrestations(@RequestBody Prestations prestations) throws URISyntaxException {
        log.debug("REST request to save Prestations : {}", prestations);
        if (prestations.getId() != null) {
            throw new BadRequestAlertException("A new prestations cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Prestations result = prestationsRepository.save(prestations);
        return ResponseEntity
            .created(new URI("/api/prestations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /prestations/:id} : Updates an existing prestations.
     *
     * @param id the id of the prestations to save.
     * @param prestations the prestations to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated prestations,
     * or with status {@code 400 (Bad Request)} if the prestations is not valid,
     * or with status {@code 500 (Internal Server Error)} if the prestations couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/prestations/{id}")
    public ResponseEntity<Prestations> updatePrestations(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Prestations prestations
    ) throws URISyntaxException {
        log.debug("REST request to update Prestations : {}, {}", id, prestations);
        if (prestations.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, prestations.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!prestationsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Prestations result = prestationsRepository.save(prestations);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, prestations.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /prestations/:id} : Partial updates given fields of an existing prestations, field will ignore if it is null
     *
     * @param id the id of the prestations to save.
     * @param prestations the prestations to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated prestations,
     * or with status {@code 400 (Bad Request)} if the prestations is not valid,
     * or with status {@code 404 (Not Found)} if the prestations is not found,
     * or with status {@code 500 (Internal Server Error)} if the prestations couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/prestations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Prestations> partialUpdatePrestations(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Prestations prestations
    ) throws URISyntaxException {
        log.debug("REST request to partial update Prestations partially : {}, {}", id, prestations);
        if (prestations.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, prestations.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!prestationsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Prestations> result = prestationsRepository
            .findById(prestations.getId())
            .map(existingPrestations -> {
                if (prestations.getLabel() != null) {
                    existingPrestations.setLabel(prestations.getLabel());
                }
                if (prestations.getMinutesDuration() != null) {
                    existingPrestations.setMinutesDuration(prestations.getMinutesDuration());
                }
                if (prestations.getPrice() != null) {
                    existingPrestations.setPrice(prestations.getPrice());
                }

                return existingPrestations;
            })
            .map(prestationsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, prestations.getId())
        );
    }

    /**
     * {@code GET  /prestations} : get all the prestations.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of prestations in body.
     */
    @GetMapping("/prestations")
    public List<Prestations> getAllPrestations(@RequestParam(required = false) String filter) {
        if ("seances-is-null".equals(filter)) {
            log.debug("REST request to get all Prestationss where seances is null");
            return StreamSupport
                .stream(prestationsRepository.findAll().spliterator(), false)
                .filter(prestations -> prestations.getSeances() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Prestations");
        return prestationsRepository.findAll();
    }

    /**
     * {@code GET  /prestations/:id} : get the "id" prestations.
     *
     * @param id the id of the prestations to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the prestations, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/prestations/{id}")
    public ResponseEntity<Prestations> getPrestations(@PathVariable String id) {
        log.debug("REST request to get Prestations : {}", id);
        Optional<Prestations> prestations = prestationsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(prestations);
    }

    /**
     * {@code DELETE  /prestations/:id} : delete the "id" prestations.
     *
     * @param id the id of the prestations to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/prestations/{id}")
    public ResponseEntity<Void> deletePrestations(@PathVariable String id) {
        log.debug("REST request to delete Prestations : {}", id);
        prestationsRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
