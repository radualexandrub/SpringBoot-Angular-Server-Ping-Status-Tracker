package com.radubulai.serverpingstatustracker.service;

import com.radubulai.serverpingstatustracker.enumeration.Status;

import java.io.IOException;

/**
 * @author Radu-Alexandru Bulai (<a href="https://radubulai.com">https://radubulai.com</a>)
 * @version 1.0
 * @since 10/07/2023
 */
public interface AppServiceI {
    Status pingServerOnly(String ipAddress) throws IOException;
}
