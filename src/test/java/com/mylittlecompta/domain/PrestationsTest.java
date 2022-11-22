package com.mylittlecompta.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mylittlecompta.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PrestationsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Prestations.class);
        Prestations prestations1 = new Prestations();
        prestations1.setId("id1");
        Prestations prestations2 = new Prestations();
        prestations2.setId(prestations1.getId());
        assertThat(prestations1).isEqualTo(prestations2);
        prestations2.setId("id2");
        assertThat(prestations1).isNotEqualTo(prestations2);
        prestations1.setId(null);
        assertThat(prestations1).isNotEqualTo(prestations2);
    }
}
