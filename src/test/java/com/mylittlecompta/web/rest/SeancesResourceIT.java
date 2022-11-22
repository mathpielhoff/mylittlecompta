package com.mylittlecompta.web.rest;

import static com.mylittlecompta.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mylittlecompta.IntegrationTest;
import com.mylittlecompta.domain.Seances;
import com.mylittlecompta.repository.SeancesRepository;
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
 * Integration tests for the {@link SeancesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SeancesResourceIT {

    private static final String DEFAULT_PLACE = "AAAAAAAAAA";
    private static final String UPDATED_PLACE = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/seances";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private SeancesRepository seancesRepository;

    @Autowired
    private MockMvc restSeancesMockMvc;

    private Seances seances;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Seances createEntity() {
        Seances seances = new Seances().place(DEFAULT_PLACE).date(DEFAULT_DATE);
        return seances;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Seances createUpdatedEntity() {
        Seances seances = new Seances().place(UPDATED_PLACE).date(UPDATED_DATE);
        return seances;
    }

    @BeforeEach
    public void initTest() {
        seancesRepository.deleteAll();
        seances = createEntity();
    }

    @Test
    void createSeances() throws Exception {
        int databaseSizeBeforeCreate = seancesRepository.findAll().size();
        // Create the Seances
        restSeancesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(seances)))
            .andExpect(status().isCreated());

        // Validate the Seances in the database
        List<Seances> seancesList = seancesRepository.findAll();
        assertThat(seancesList).hasSize(databaseSizeBeforeCreate + 1);
        Seances testSeances = seancesList.get(seancesList.size() - 1);
        assertThat(testSeances.getPlace()).isEqualTo(DEFAULT_PLACE);
        assertThat(testSeances.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    void createSeancesWithExistingId() throws Exception {
        // Create the Seances with an existing ID
        seances.setId("existing_id");

        int databaseSizeBeforeCreate = seancesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSeancesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(seances)))
            .andExpect(status().isBadRequest());

        // Validate the Seances in the database
        List<Seances> seancesList = seancesRepository.findAll();
        assertThat(seancesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllSeances() throws Exception {
        // Initialize the database
        seancesRepository.save(seances);

        // Get all the seancesList
        restSeancesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(seances.getId())))
            .andExpect(jsonPath("$.[*].place").value(hasItem(DEFAULT_PLACE)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }

    @Test
    void getSeances() throws Exception {
        // Initialize the database
        seancesRepository.save(seances);

        // Get the seances
        restSeancesMockMvc
            .perform(get(ENTITY_API_URL_ID, seances.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(seances.getId()))
            .andExpect(jsonPath("$.place").value(DEFAULT_PLACE))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)));
    }

    @Test
    void getNonExistingSeances() throws Exception {
        // Get the seances
        restSeancesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingSeances() throws Exception {
        // Initialize the database
        seancesRepository.save(seances);

        int databaseSizeBeforeUpdate = seancesRepository.findAll().size();

        // Update the seances
        Seances updatedSeances = seancesRepository.findById(seances.getId()).get();
        updatedSeances.place(UPDATED_PLACE).date(UPDATED_DATE);

        restSeancesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSeances.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSeances))
            )
            .andExpect(status().isOk());

        // Validate the Seances in the database
        List<Seances> seancesList = seancesRepository.findAll();
        assertThat(seancesList).hasSize(databaseSizeBeforeUpdate);
        Seances testSeances = seancesList.get(seancesList.size() - 1);
        assertThat(testSeances.getPlace()).isEqualTo(UPDATED_PLACE);
        assertThat(testSeances.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    void putNonExistingSeances() throws Exception {
        int databaseSizeBeforeUpdate = seancesRepository.findAll().size();
        seances.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSeancesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, seances.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(seances))
            )
            .andExpect(status().isBadRequest());

        // Validate the Seances in the database
        List<Seances> seancesList = seancesRepository.findAll();
        assertThat(seancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchSeances() throws Exception {
        int databaseSizeBeforeUpdate = seancesRepository.findAll().size();
        seances.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSeancesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(seances))
            )
            .andExpect(status().isBadRequest());

        // Validate the Seances in the database
        List<Seances> seancesList = seancesRepository.findAll();
        assertThat(seancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamSeances() throws Exception {
        int databaseSizeBeforeUpdate = seancesRepository.findAll().size();
        seances.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSeancesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(seances)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Seances in the database
        List<Seances> seancesList = seancesRepository.findAll();
        assertThat(seancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateSeancesWithPatch() throws Exception {
        // Initialize the database
        seancesRepository.save(seances);

        int databaseSizeBeforeUpdate = seancesRepository.findAll().size();

        // Update the seances using partial update
        Seances partialUpdatedSeances = new Seances();
        partialUpdatedSeances.setId(seances.getId());

        partialUpdatedSeances.place(UPDATED_PLACE);

        restSeancesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSeances.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSeances))
            )
            .andExpect(status().isOk());

        // Validate the Seances in the database
        List<Seances> seancesList = seancesRepository.findAll();
        assertThat(seancesList).hasSize(databaseSizeBeforeUpdate);
        Seances testSeances = seancesList.get(seancesList.size() - 1);
        assertThat(testSeances.getPlace()).isEqualTo(UPDATED_PLACE);
        assertThat(testSeances.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    void fullUpdateSeancesWithPatch() throws Exception {
        // Initialize the database
        seancesRepository.save(seances);

        int databaseSizeBeforeUpdate = seancesRepository.findAll().size();

        // Update the seances using partial update
        Seances partialUpdatedSeances = new Seances();
        partialUpdatedSeances.setId(seances.getId());

        partialUpdatedSeances.place(UPDATED_PLACE).date(UPDATED_DATE);

        restSeancesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSeances.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSeances))
            )
            .andExpect(status().isOk());

        // Validate the Seances in the database
        List<Seances> seancesList = seancesRepository.findAll();
        assertThat(seancesList).hasSize(databaseSizeBeforeUpdate);
        Seances testSeances = seancesList.get(seancesList.size() - 1);
        assertThat(testSeances.getPlace()).isEqualTo(UPDATED_PLACE);
        assertThat(testSeances.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    void patchNonExistingSeances() throws Exception {
        int databaseSizeBeforeUpdate = seancesRepository.findAll().size();
        seances.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSeancesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, seances.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(seances))
            )
            .andExpect(status().isBadRequest());

        // Validate the Seances in the database
        List<Seances> seancesList = seancesRepository.findAll();
        assertThat(seancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchSeances() throws Exception {
        int databaseSizeBeforeUpdate = seancesRepository.findAll().size();
        seances.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSeancesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(seances))
            )
            .andExpect(status().isBadRequest());

        // Validate the Seances in the database
        List<Seances> seancesList = seancesRepository.findAll();
        assertThat(seancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamSeances() throws Exception {
        int databaseSizeBeforeUpdate = seancesRepository.findAll().size();
        seances.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSeancesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(seances)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Seances in the database
        List<Seances> seancesList = seancesRepository.findAll();
        assertThat(seancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteSeances() throws Exception {
        // Initialize the database
        seancesRepository.save(seances);

        int databaseSizeBeforeDelete = seancesRepository.findAll().size();

        // Delete the seances
        restSeancesMockMvc
            .perform(delete(ENTITY_API_URL_ID, seances.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Seances> seancesList = seancesRepository.findAll();
        assertThat(seancesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
