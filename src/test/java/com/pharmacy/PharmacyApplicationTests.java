package com.pharmacy;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.SQLException;

@SpringBootTest
class PharmacyApplicationTests {
    @Autowired
    DataSource dataSource;

    @Test
    void contextLoads() {
    }
}
