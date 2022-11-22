package com.mylittlecompta.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mylittlecompta.IntegrationTest;
import com.mylittlecompta.domain.Prestations;
import com.mylittlecompta.repository.PrestationsRepository;
import java.time.Duration;
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
 * Integration tests for the {@link PrestationsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PrestationsResourceIT {

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final Duration DEFAULT_MINUTES_DURATION = Duration.ofHours(6);
    private static final Duration UPDATED_MINUTES_DURATION = Duration.ofHours(12);

    private static final Float DEFAULT_PRICE = 1F;
    private static final Float UPDATED_PRICE = 2F;

    private static final String ENTITY_API_URL = "/api/prestations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private PrestationsRepository prestationsRepository;

    @Autowired
    private MockMvc restPrestationsMockMvc;

    private Prestations prestations;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Prestations createEntity() {
        Prestations prestations = new Prestations().label(DEFAULT_LABEL).minutesDuration(DEFAULT_MINUTES_DURATION).price(DEFAULT_PRICE);
        return prestations;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Prestations createUpdatedEntity() {
        Prestations prestations = new Prestations().label(UPDATED_LABEL).minutesDuration(UPDATED_MINUTES_DURATION).price(UPDATED_PRICE);
        return prestations;
    }

    @BeforeEach
    public void initTest() {
        prestationsRepository.deleteAll();
        prestations = createEntity();
    }

    @Test
    void createPrestations() throws Exception {
        int databaseSizeBeforeCreate = prestationsRepository.findAll().size();
        // Create the Prestations
        restPrestationsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(prestations)))
            .andExpect(status().isCreated());

        // Validate the Prestations in the database
        List<Prestations> prestationsList = prestationsRepository.findAll();
        assertThat(prestationsList).hasSize(databaseSizeBeforeCreate + 1);
        Prestations testPrestations = prestationsList.get(prestationsList.size() - 1);
        assertThat(testPrestations.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testPrestations.getMinutesDuration()).isEqualTo(DEFAULT_MINUTES_DURATION);
        assertThat(testPrestations.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    void createPrestationsWithExistingId() throws Exception {
        // Create the Prestations with an existing ID
        prestations.setId("existing_id");

        int databaseSizeBeforeCreate = prestationsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPrestationsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(prestations)))
            .andExpect(status().isBadRequest());

        // Validate the Prestations in the database
        List<Prestations> prestationsList = prestationsRepository.findAll();
        assertThat(prestationsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllPrestations() throws Exception {
        // Initialize the database
        prestationsRepository.save(prestations);

        // Get all the prestationsList
        restPrestationsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(prestations.getId())))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)))
            .andExpect(jsonPath("$.[*].minutesDuration").value(hasItem(DEFAULT_MINUTES_DURATION.toString())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())));
    }

    @Test
    void getPrestations() throws Exception {
        // Initialize the database
        prestationsRepository.save(prestations);

        // Get the prestations
        restPrestationsMockMvc
            .perform(get(ENTITY_API_URL_ID, prestations.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(prestations.getId()))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL))
            .andExpect(jsonPath("$.minutesDuration").value(DEFAULT_MINUTES_DURATION.toString()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()));
    }

    @Test
    void getNonExistingPrestations() throws Exception {
        // Get the prestations
        restPrestationsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingPrestations() throws Exception {
        // Initialize the database
        prestationsRepository.save(prestations);

        int databaseSizeBeforeUpdate = prestationsRepository.findAll().size();

        // Update the prestations
        Prestations updatedPrestations = prestationsRepository.findById(prestations.getId()).get();
        updatedPrestations.label(UPDATED_LABEL).minutesDuration(UPDATED_MINUTES_DURATION).price(UPDATED_PRICE);

        restPrestationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPrestations.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPrestations))
            )
            .andExpect(status().isOk());

        // Validate the Prestations in the database
        List<Prestations> prestationsList = prestationsRepository.findAll();
        assertThat(prestationsList).hasSize(databaseSizeBeforeUpdate);
        Prestations testPrestations = prestationsList.get(prestationsList.size() - 1);
        assertThat(testPrestations.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testPrestations.getMinutesDuration()).isEqualTo(UPDATED_MINUTES_DURATION);
        assertThat(testPrestations.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    void putNonExistingPrestations() throws Exception {
        int databaseSizeBeforeUpdate = prestationsRepository.findAll().size();
        prestations.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPrestationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, prestations.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(prestations))
            )
            .andExpect(status().isBadRequest());

        // Validate the Prestations in the database
        List<Prestations> prestationsList = prestationsRepository.findAll();
        assertThat(prestationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchPrestations() throws Exception {
        int databaseSizeBeforeUpdate = prestationsRepository.findAll().size();
        prestations.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPrestationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(prestations))
            )
            .andExpect(status().isBadRequest());

        // Validate the Prestations in the database
        List<Prestations> prestationsList = prestationsRepository.findAll();
        assertThat(prestationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamPrestations() throws Exception {
        int databaseSizeBeforeUpdate = prestationsRepository.findAll().size();
        prestations.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPrestationsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(prestations)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Prestations in the database
        List<Prestations> prestationsList = prestationsRepository.findAll();
        assertThat(prestationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdatePrestationsWithPatch() throws Exception {
        // Initialize the database
        prestationsRepository.save(prestations);

        int databaseSizeBeforeUpdate = prestationsRepository.findAll().size();

        // Update the prestations using partial update
        Prestations partialUpdatedPrestations = new Prestations();
        partialUpdatedPrestations.setId(prestations.getId());

        partialUpdatedPrestations.label(UPDATED_LABEL);

        restPrestationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPrestations.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPrestations))
            )
            .andExpect(status().isOk());

        // Validate the Prestations in the database
        List<Prestations> prestationsList = prestationsRepository.findAll();
        assertThat(prestationsList).hasSize(databaseSizeBeforeUpdate);
        Prestations testPrestations = prestationsList.get(prestationsList.size() - 1);
        assertThat(testPrestations.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testPrestations.getMinutesDuration()).isEqualTo(DEFAULT_MINUTES_DURATION);
        assertThat(testPrestations.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    void fullUpdatePrestationsWithPatch() throws Exception {
        // Initialize the database
        prestationsRepository.save(prestations);

        int databaseSizeBeforeUpdate = prestationsRepository.findAll().size();

        // Update the prestations using partial update
        Prestations partialUpdatedPrestations = new Prestations();
        partialUpdatedPrestations.setId(prestations.getId());

        partialUpdatedPrestations.label(UPDATED_LABEL).minutesDuration(UPDATED_MINUTES_DURATION).price(UPDATED_PRICE);

        restPrestationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPrestations.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPrestations))
            )
            .andExpect(status().isOk());

        // Validate the Prestations in the database
        List<Prestations> prestationsList = prestationsRepository.findAll();
        assertThat(prestationsList).hasSize(databaseSizeBeforeUpdate);
        Prestations testPrestations = prestationsList.get(prestationsList.size() - 1);
        assertThat(testPrestations.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testPrestations.getMinutesDuration()).isEqualTo(UPDATED_MINUTES_DURATION);
        assertThat(testPrestations.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    void patchNonExistingPrestations() throws Exception {
        int databaseSizeBeforeUpdate = prestationsRepository.findAll().size();
        prestations.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPrestationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, prestations.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(prestations))
            )
            .andExpect(status().isBadRequest());

        // Validate the Prestations in the database
        List<Prestations> prestationsList = prestationsRepository.findAll();
        assertThat(prestationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchPrestations() throws Exception {
        int databaseSizeBeforeUpdate = prestationsRepository.findAll().size();
        prestations.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPrestationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(prestations))
            )
            .andExpect(status().isBadRequest());

        // Validate the Prestations in the database
        List<Prestations> prestationsList = prestationsRepository.findAll();
        assertThat(prestationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamPrestations() throws Exception {
        int databaseSizeBeforeUpdate = prestationsRepository.findAll().size();
        prestations.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPrestationsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(prestations))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Prestations in the database
        List<Prestations> prestationsList = prestationsRepository.findAll();
        assertThat(prestationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deletePrestations() throws Exception {
        // Initialize the database
        prestationsRepository.save(prestations);

        int databaseSizeBeforeDelete = prestationsRepository.findAll().size();

        // Delete the prestations
        restPrestationsMockMvc
            .perform(delete(ENTITY_API_URL_ID, prestations.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Prestations> prestationsList = prestationsRepository.findAll();
        assertThat(prestationsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
