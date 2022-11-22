package com.mylittlecompta.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mylittlecompta.IntegrationTest;
import com.mylittlecompta.domain.Patients;
import com.mylittlecompta.repository.PatientsRepository;
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
 * Integration tests for the {@link PatientsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PatientsResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_AGE = "AAAAAAAAAA";
    private static final String UPDATED_AGE = "BBBBBBBBBB";

    private static final String DEFAULT_SCHOOL_CLASS = "AAAAAAAAAA";
    private static final String UPDATED_SCHOOL_CLASS = "BBBBBBBBBB";

    private static final String DEFAULT_SCHOOL = "AAAAAAAAAA";
    private static final String UPDATED_SCHOOL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/patients";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private PatientsRepository patientsRepository;

    @Autowired
    private MockMvc restPatientsMockMvc;

    private Patients patients;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Patients createEntity() {
        Patients patients = new Patients()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .age(DEFAULT_AGE)
            .schoolClass(DEFAULT_SCHOOL_CLASS)
            .school(DEFAULT_SCHOOL);
        return patients;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Patients createUpdatedEntity() {
        Patients patients = new Patients()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .age(UPDATED_AGE)
            .schoolClass(UPDATED_SCHOOL_CLASS)
            .school(UPDATED_SCHOOL);
        return patients;
    }

    @BeforeEach
    public void initTest() {
        patientsRepository.deleteAll();
        patients = createEntity();
    }

    @Test
    void createPatients() throws Exception {
        int databaseSizeBeforeCreate = patientsRepository.findAll().size();
        // Create the Patients
        restPatientsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(patients)))
            .andExpect(status().isCreated());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeCreate + 1);
        Patients testPatients = patientsList.get(patientsList.size() - 1);
        assertThat(testPatients.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testPatients.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testPatients.getAge()).isEqualTo(DEFAULT_AGE);
        assertThat(testPatients.getSchoolClass()).isEqualTo(DEFAULT_SCHOOL_CLASS);
        assertThat(testPatients.getSchool()).isEqualTo(DEFAULT_SCHOOL);
    }

    @Test
    void createPatientsWithExistingId() throws Exception {
        // Create the Patients with an existing ID
        patients.setId("existing_id");

        int databaseSizeBeforeCreate = patientsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPatientsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(patients)))
            .andExpect(status().isBadRequest());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllPatients() throws Exception {
        // Initialize the database
        patientsRepository.save(patients);

        // Get all the patientsList
        restPatientsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(patients.getId())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].age").value(hasItem(DEFAULT_AGE)))
            .andExpect(jsonPath("$.[*].schoolClass").value(hasItem(DEFAULT_SCHOOL_CLASS)))
            .andExpect(jsonPath("$.[*].school").value(hasItem(DEFAULT_SCHOOL)));
    }

    @Test
    void getPatients() throws Exception {
        // Initialize the database
        patientsRepository.save(patients);

        // Get the patients
        restPatientsMockMvc
            .perform(get(ENTITY_API_URL_ID, patients.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(patients.getId()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.age").value(DEFAULT_AGE))
            .andExpect(jsonPath("$.schoolClass").value(DEFAULT_SCHOOL_CLASS))
            .andExpect(jsonPath("$.school").value(DEFAULT_SCHOOL));
    }

    @Test
    void getNonExistingPatients() throws Exception {
        // Get the patients
        restPatientsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingPatients() throws Exception {
        // Initialize the database
        patientsRepository.save(patients);

        int databaseSizeBeforeUpdate = patientsRepository.findAll().size();

        // Update the patients
        Patients updatedPatients = patientsRepository.findById(patients.getId()).get();
        updatedPatients
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .age(UPDATED_AGE)
            .schoolClass(UPDATED_SCHOOL_CLASS)
            .school(UPDATED_SCHOOL);

        restPatientsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPatients.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPatients))
            )
            .andExpect(status().isOk());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeUpdate);
        Patients testPatients = patientsList.get(patientsList.size() - 1);
        assertThat(testPatients.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testPatients.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testPatients.getAge()).isEqualTo(UPDATED_AGE);
        assertThat(testPatients.getSchoolClass()).isEqualTo(UPDATED_SCHOOL_CLASS);
        assertThat(testPatients.getSchool()).isEqualTo(UPDATED_SCHOOL);
    }

    @Test
    void putNonExistingPatients() throws Exception {
        int databaseSizeBeforeUpdate = patientsRepository.findAll().size();
        patients.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPatientsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, patients.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(patients))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchPatients() throws Exception {
        int databaseSizeBeforeUpdate = patientsRepository.findAll().size();
        patients.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPatientsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(patients))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamPatients() throws Exception {
        int databaseSizeBeforeUpdate = patientsRepository.findAll().size();
        patients.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPatientsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(patients)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdatePatientsWithPatch() throws Exception {
        // Initialize the database
        patientsRepository.save(patients);

        int databaseSizeBeforeUpdate = patientsRepository.findAll().size();

        // Update the patients using partial update
        Patients partialUpdatedPatients = new Patients();
        partialUpdatedPatients.setId(patients.getId());

        partialUpdatedPatients.lastName(UPDATED_LAST_NAME);

        restPatientsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPatients.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPatients))
            )
            .andExpect(status().isOk());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeUpdate);
        Patients testPatients = patientsList.get(patientsList.size() - 1);
        assertThat(testPatients.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testPatients.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testPatients.getAge()).isEqualTo(DEFAULT_AGE);
        assertThat(testPatients.getSchoolClass()).isEqualTo(DEFAULT_SCHOOL_CLASS);
        assertThat(testPatients.getSchool()).isEqualTo(DEFAULT_SCHOOL);
    }

    @Test
    void fullUpdatePatientsWithPatch() throws Exception {
        // Initialize the database
        patientsRepository.save(patients);

        int databaseSizeBeforeUpdate = patientsRepository.findAll().size();

        // Update the patients using partial update
        Patients partialUpdatedPatients = new Patients();
        partialUpdatedPatients.setId(patients.getId());

        partialUpdatedPatients
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .age(UPDATED_AGE)
            .schoolClass(UPDATED_SCHOOL_CLASS)
            .school(UPDATED_SCHOOL);

        restPatientsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPatients.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPatients))
            )
            .andExpect(status().isOk());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeUpdate);
        Patients testPatients = patientsList.get(patientsList.size() - 1);
        assertThat(testPatients.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testPatients.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testPatients.getAge()).isEqualTo(UPDATED_AGE);
        assertThat(testPatients.getSchoolClass()).isEqualTo(UPDATED_SCHOOL_CLASS);
        assertThat(testPatients.getSchool()).isEqualTo(UPDATED_SCHOOL);
    }

    @Test
    void patchNonExistingPatients() throws Exception {
        int databaseSizeBeforeUpdate = patientsRepository.findAll().size();
        patients.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPatientsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, patients.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(patients))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchPatients() throws Exception {
        int databaseSizeBeforeUpdate = patientsRepository.findAll().size();
        patients.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPatientsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(patients))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamPatients() throws Exception {
        int databaseSizeBeforeUpdate = patientsRepository.findAll().size();
        patients.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPatientsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(patients)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deletePatients() throws Exception {
        // Initialize the database
        patientsRepository.save(patients);

        int databaseSizeBeforeDelete = patientsRepository.findAll().size();

        // Delete the patients
        restPatientsMockMvc
            .perform(delete(ENTITY_API_URL_ID, patients.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
