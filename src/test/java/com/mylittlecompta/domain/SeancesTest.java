package com.mylittlecompta.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mylittlecompta.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SeancesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Seances.class);
        Seances seances1 = new Seances();
        seances1.setId("id1");
        Seances seances2 = new Seances();
        seances2.setId(seances1.getId());
        assertThat(seances1).isEqualTo(seances2);
        seances2.setId("id2");
        assertThat(seances1).isNotEqualTo(seances2);
        seances1.setId(null);
        assertThat(seances1).isNotEqualTo(seances2);
    }
}
