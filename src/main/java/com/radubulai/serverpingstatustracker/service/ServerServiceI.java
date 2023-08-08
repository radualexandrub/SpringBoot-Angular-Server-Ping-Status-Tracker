package com.radubulai.serverpingstatustracker.service;

import com.radubulai.serverpingstatustracker.model.Server;

import java.io.IOException;
import java.util.Collection;
import java.util.List;

/**
 * @author Radu-Alexandru Bulai (<a href="https://radubulai.com">https://radubulai.com</a>)
 * @version 1.0
 * @since 06/07/2023
 */
public interface ServerServiceI {

    Collection<Server> findAllServers();

    Server addServer(Server server);

    List<Server> addServers(Server[] servers);

    Server updateServer(Server server);

    Boolean deleteServerById(Long id);

    Server pingServer(String ipAddress) throws IOException;

    Server pingServer(Long id) throws IOException;

    Collection<Server> pingAllServers() throws IOException, InterruptedException;

    Boolean deleteAllServers();
}
