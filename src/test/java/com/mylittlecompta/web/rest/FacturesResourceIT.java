package com.mylittlecompta.web.rest;

import static com.mylittlecompta.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mylittlecompta.IntegrationTest;
import com.mylittlecompta.domain.Factures;
import com.mylittlecompta.repository.FacturesRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link FacturesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FacturesResourceIT {

    private static final String DEFAULT_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_NUMBER = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_EMISSION_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_EMISSION_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Boolean DEFAULT_PAID_INVOICE = false;
    private static final Boolean UPDATED_PAID_INVOICE = true;

    private static final String ENTITY_API_URL = "/api/factures";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private FacturesRepository facturesRepository;

    @Autowired
    private MockMvc restFacturesMockMvc;

    private Factures factures;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Factures createEntity() {
        Factures factures = new Factures().number(DEFAULT_NUMBER).emissionDate(DEFAULT_EMISSION_DATE).paidInvoice(DEFAULT_PAID_INVOICE);
        return factures;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Factures createUpdatedEntity() {
        Factures factures = new Factures().number(UPDATED_NUMBER).emissionDate(UPDATED_EMISSION_DATE).paidInvoice(UPDATED_PAID_INVOICE);
        return factures;
    }

    @BeforeEach
    public void initTest() {
        facturesRepository.deleteAll();
        factures = createEntity();
    }

    @Test
    void createFactures() throws Exception {
        int databaseSizeBeforeCreate = facturesRepository.findAll().size();
        // Create the Factures
        restFacturesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(factures)))
            .andExpect(status().isCreated());

        // Validate the Factures in the database
        List<Factures> facturesList = facturesRepository.findAll();
        assertThat(facturesList).hasSize(databaseSizeBeforeCreate + 1);
        Factures testFactures = facturesList.get(facturesList.size() - 1);
        assertThat(testFactures.getNumber()).isEqualTo(DEFAULT_NUMBER);
        assertThat(testFactures.getEmissionDate()).isEqualTo(DEFAULT_EMISSION_DATE);
        assertThat(testFactures.getPaidInvoice()).isEqualTo(DEFAULT_PAID_INVOICE);
    }

    @Test
    void createFacturesWithExistingId() throws Exception {
        // Create the Factures with an existing ID
        factures.setId("existing_id");

        int databaseSizeBeforeCreate = facturesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFacturesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(factures)))
            .andExpect(status().isBadRequest());

        // Validate the Factures in the database
        List<Factures> facturesList = facturesRepository.findAll();
        assertThat(facturesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllFactures() throws Exception {
        // Initialize the database
        facturesRepository.save(factures);

        // Get all the facturesList
        restFacturesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(factures.getId())))
            .andExpect(jsonPath("$.[*].number").value(hasItem(DEFAULT_NUMBER)))
            .andExpect(jsonPath("$.[*].emissionDate").value(hasItem(sameInstant(DEFAULT_EMISSION_DATE))))
            .andExpect(jsonPath("$.[*].paidInvoice").value(hasItem(DEFAULT_PAID_INVOICE.booleanValue())));
    }

    @Test
    void getFactures() throws Exception {
        // Initialize the database
        facturesRepository.save(factures);

        // Get the factures
        restFacturesMockMvc
            .perform(get(ENTITY_API_URL_ID, factures.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(factures.getId()))
            .andExpect(jsonPath("$.number").value(DEFAULT_NUMBER))
            .andExpect(jsonPath("$.emissionDate").value(sameInstant(DEFAULT_EMISSION_DATE)))
            .andExpect(jsonPath("$.paidInvoice").value(DEFAULT_PAID_INVOICE.booleanValue()));
    }

    @Test
    void getNonExistingFactures() throws Exception {
        // Get the factures
        restFacturesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingFactures() throws Exception {
        // Initialize the database
        facturesRepository.save(factures);

        int databaseSizeBeforeUpdate = facturesRepository.findAll().size();

        // Update the factures
        Factures updatedFactures = facturesRepository.findById(factures.getId()).get();
        updatedFactures.number(UPDATED_NUMBER).emissionDate(UPDATED_EMISSION_DATE).paidInvoice(UPDATED_PAID_INVOICE);

        restFacturesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFactures.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFactures))
            )
            .andExpect(status().isOk());

        // Validate the Factures in the database
        List<Factures> facturesList = facturesRepository.findAll();
        assertThat(facturesList).hasSize(databaseSizeBeforeUpdate);
        Factures testFactures = facturesList.get(facturesList.size() - 1);
        assertThat(testFactures.getNumber()).isEqualTo(UPDATED_NUMBER);
        assertThat(testFactures.getEmissionDate()).isEqualTo(UPDATED_EMISSION_DATE);
        assertThat(testFactures.getPaidInvoice()).isEqualTo(UPDATED_PAID_INVOICE);
    }

    @Test
    void putNonExistingFactures() throws Exception {
        int databaseSizeBeforeUpdate = facturesRepository.findAll().size();
        factures.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFacturesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, factures.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(factures))
            )
            .andExpect(status().isBadRequest());

        // Validate the Factures in the database
        List<Factures> facturesList = facturesRepository.findAll();
        assertThat(facturesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchFactures() throws Exception {
        int databaseSizeBeforeUpdate = facturesRepository.findAll().size();
        factures.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFacturesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(factures))
            )
            .andExpect(status().isBadRequest());

        // Validate the Factures in the database
        List<Factures> facturesList = facturesRepository.findAll();
        assertThat(facturesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamFactures() throws Exception {
        int databaseSizeBeforeUpdate = facturesRepository.findAll().size();
        factures.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFacturesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(factures)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Factures in the database
        List<Factures> facturesList = facturesRepository.findAll();
        assertThat(facturesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateFacturesWithPatch() throws Exception {
        // Initialize the database
        facturesRepository.save(factures);

        int databaseSizeBeforeUpdate = facturesRepository.findAll().size();

        // Update the factures using partial update
        Factures partialUpdatedFactures = new Factures();
        partialUpdatedFactures.setId(factures.getId());

        partialUpdatedFactures.number(UPDATED_NUMBER).emissionDate(UPDATED_EMISSION_DATE);

        restFacturesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFactures.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFactures))
            )
            .andExpect(status().isOk());

        // Validate the Factures in the database
        List<Factures> facturesList = facturesRepository.findAll();
        assertThat(facturesList).hasSize(databaseSizeBeforeUpdate);
        Factures testFactures = facturesList.get(facturesList.size() - 1);
        assertThat(testFactures.getNumber()).isEqualTo(UPDATED_NUMBER);
        assertThat(testFactures.getEmissionDate()).isEqualTo(UPDATED_EMISSION_DATE);
        assertThat(testFactures.getPaidInvoice()).isEqualTo(DEFAULT_PAID_INVOICE);
    }

    @Test
    void fullUpdateFacturesWithPatch() throws Exception {
        // Initialize the database
        facturesRepository.save(factures);

        int databaseSizeBeforeUpdate = facturesRepository.findAll().size();

        // Update the factures using partial update
        Factures partialUpdatedFactures = new Factures();
        partialUpdatedFactures.setId(factures.getId());

        partialUpdatedFactures.number(UPDATED_NUMBER).emissionDate(UPDATED_EMISSION_DATE).paidInvoice(UPDATED_PAID_INVOICE);

        restFacturesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFactures.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFactures))
            )
            .andExpect(status().isOk());

        // Validate the Factures in the database
        List<Factures> facturesList = facturesRepository.findAll();
        assertThat(facturesList).hasSize(databaseSizeBeforeUpdate);
        Factures testFactures = facturesList.get(facturesList.size() - 1);
        assertThat(testFactures.getNumber()).isEqualTo(UPDATED_NUMBER);
        assertThat(testFactures.getEmissionDate()).isEqualTo(UPDATED_EMISSION_DATE);
        assertThat(testFactures.getPaidInvoice()).isEqualTo(UPDATED_PAID_INVOICE);
    }

    @Test
    void patchNonExistingFactures() throws Exception {
        int databaseSizeBeforeUpdate = facturesRepository.findAll().size();
        factures.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFacturesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, factures.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(factures))
            )
            .andExpect(status().isBadRequest());

        // Validate the Factures in the database
        List<Factures> facturesList = facturesRepository.findAll();
        assertThat(facturesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchFactures() throws Exception {
        int databaseSizeBeforeUpdate = facturesRepository.findAll().size();
        factures.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFacturesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(factures))
            )
            .andExpect(status().isBadRequest());

        // Validate the Factures in the database
        List<Factures> facturesList = facturesRepository.findAll();
        assertThat(facturesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamFactures() throws Exception {
        int databaseSizeBeforeUpdate = facturesRepository.findAll().size();
        factures.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFacturesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(factures)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Factures in the database
        List<Factures> facturesList = facturesRepository.findAll();
        assertThat(facturesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteFactures() throws Exception {
        // Initialize the database
        facturesRepository.save(factures);

        int databaseSizeBeforeDelete = facturesRepository.findAll().size();

        // Delete the factures
        restFacturesMockMvc
            .perform(delete(ENTITY_API_URL_ID, factures.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Factures> facturesList = facturesRepository.findAll();
        assertThat(facturesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
