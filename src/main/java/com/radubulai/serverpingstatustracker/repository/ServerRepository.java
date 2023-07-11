package com.radubulai.serverpingstatustracker.repository;

import com.radubulai.serverpingstatustracker.model.Server;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * @author Radu-Alexandru Bulai (<a href="https://radubulai.com">https://radubulai.com</a>)
 * @version 1.0
 * @since 06/07/2023
 */
public interface ServerRepository extends JpaRepository<Server, Long> {

    Server findServerByIpAddress(String ipAddress);
    void deleteServerById(Long id);
    Optional<Server> findServerById(Long id);
}
