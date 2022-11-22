package com.mylittlecompta.web.rest;

import com.mylittlecompta.domain.Seances;
import com.mylittlecompta.repository.SeancesRepository;
import com.mylittlecompta.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mylittlecompta.domain.Seances}.
 */
@RestController
@RequestMapping("/api")
public class SeancesResource {

    private final Logger log = LoggerFactory.getLogger(SeancesResource.class);

    private static final String ENTITY_NAME = "seances";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SeancesRepository seancesRepository;

    public SeancesResource(SeancesRepository seancesRepository) {
        this.seancesRepository = seancesRepository;
    }

    /**
     * {@code POST  /seances} : Create a new seances.
     *
     * @param seances the seances to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new seances, or with status {@code 400 (Bad Request)} if the seances has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/seances")
    public ResponseEntity<Seances> createSeances(@RequestBody Seances seances) throws URISyntaxException {
        log.debug("REST request to save Seances : {}", seances);
        if (seances.getId() != null) {
            throw new BadRequestAlertException("A new seances cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Seances result = seancesRepository.save(seances);
        return ResponseEntity
            .created(new URI("/api/seances/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /seances/:id} : Updates an existing seances.
     *
     * @param id the id of the seances to save.
     * @param seances the seances to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated seances,
     * or with status {@code 400 (Bad Request)} if the seances is not valid,
     * or with status {@code 500 (Internal Server Error)} if the seances couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/seances/{id}")
    public ResponseEntity<Seances> updateSeances(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Seances seances
    ) throws URISyntaxException {
        log.debug("REST request to update Seances : {}, {}", id, seances);
        if (seances.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, seances.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!seancesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Seances result = seancesRepository.save(seances);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, seances.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /seances/:id} : Partial updates given fields of an existing seances, field will ignore if it is null
     *
     * @param id the id of the seances to save.
     * @param seances the seances to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated seances,
     * or with status {@code 400 (Bad Request)} if the seances is not valid,
     * or with status {@code 404 (Not Found)} if the seances is not found,
     * or with status {@code 500 (Internal Server Error)} if the seances couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/seances/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Seances> partialUpdateSeances(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Seances seances
    ) throws URISyntaxException {
        log.debug("REST request to partial update Seances partially : {}, {}", id, seances);
        if (seances.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, seances.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!seancesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Seances> result = seancesRepository
            .findById(seances.getId())
            .map(existingSeances -> {
                if (seances.getPlace() != null) {
                    existingSeances.setPlace(seances.getPlace());
                }
                if (seances.getDate() != null) {
                    existingSeances.setDate(seances.getDate());
                }

                return existingSeances;
            })
            .map(seancesRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, seances.getId()));
    }

    /**
     * {@code GET  /seances} : get all the seances.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of seances in body.
     */
    @GetMapping("/seances")
    public List<Seances> getAllSeances() {
        log.debug("REST request to get all Seances");
        return seancesRepository.findAll();
    }

    /**
     * {@code GET  /seances/:id} : get the "id" seances.
     *
     * @param id the id of the seances to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the seances, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/seances/{id}")
    public ResponseEntity<Seances> getSeances(@PathVariable String id) {
        log.debug("REST request to get Seances : {}", id);
        Optional<Seances> seances = seancesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(seances);
    }

    /**
     * {@code DELETE  /seances/:id} : delete the "id" seances.
     *
     * @param id the id of the seances to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/seances/{id}")
    public ResponseEntity<Void> deleteSeances(@PathVariable String id) {
        log.debug("REST request to delete Seances : {}", id);
        seancesRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
