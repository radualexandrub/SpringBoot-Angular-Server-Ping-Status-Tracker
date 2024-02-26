package com.radubulai.serverpingstatustracker.model;

import com.radubulai.serverpingstatustracker.enumeration.Status;
import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;

import static javax.persistence.GenerationType.AUTO;

/**
 * @author Radu-Alexandru Bulai (<a href="https://radubulai.com">https://radubulai.com</a>)
 * @version 1.0
 * @since 06/07/2023
 */
@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Server {
    @Id
    @GeneratedValue(strategy = AUTO)
    // Type Long = BIGINT in MySQL
    private Long id;
    @Column(nullable = false, unique = true)
    @NotEmpty(message = "IP Address cannot be empty or null")
    // Type String = VARCHAR(255) in MySQL
    private String ipAddress;
    private String name;
    private String network;
    @Column(columnDefinition = "TEXT")
    private String details;
    private Status status;
}
