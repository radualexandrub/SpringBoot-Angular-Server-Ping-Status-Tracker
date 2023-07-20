package com.radubulai.serverpingstatustracker.service.implementation;

import com.radubulai.serverpingstatustracker.ServerpingstatustrackerConfig;
import com.radubulai.serverpingstatustracker.exception.ServerNotFoundException;
import com.radubulai.serverpingstatustracker.model.Server;
import com.radubulai.serverpingstatustracker.repository.ServerRepository;
import com.radubulai.serverpingstatustracker.service.ServerServiceI;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.net.InetAddress;
import java.util.Collection;
import java.util.concurrent.TimeUnit;

import static com.radubulai.serverpingstatustracker.enumeration.Status.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ServerServiceImpl implements ServerServiceI {
    private final ServerRepository serverRepository;
    int IS_REACHABLE_TIMEOUT_IN_MILLIS = ServerpingstatustrackerConfig.getIsReachableTimeoutInMillis();

    @Override
    public Collection<Server> findAllServers() {
        return serverRepository.findAll();
    }

    public Collection<Server> findAllServers(int limit) {
        log.info("Fetching {} servers", limit);
        return serverRepository.findAll(PageRequest.of(0, limit)).toList();
    }

    public Page<Server> findAllServers(int pageNumber, int pageSize) {
        log.info("Fetching {} servers (Page {})", pageSize, pageNumber);
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        return serverRepository.findAll(pageable);
    }

    public Server findServerById(Long id) {
        log.info("Fetching server with id={}", id);
        return serverRepository.findServerById(id).orElseThrow(
                () -> new ServerNotFoundException("Server by id " + id + " was not found")
        );
    }

    @Override
    public Server addServer(Server server) {
        log.info("Saving Server {}", server);
        return serverRepository.save(server);
    }

    @Override
    public Server updateServer(Server server) {
        log.info("Updating Server {}", server);
        return serverRepository.save(server);
    }

    @Override
    public Boolean deleteServerById(Long id) {
        log.info("Deleting Server with id={}", id);
        serverRepository.deleteServerById(id);
        return Boolean.TRUE;
    }

    @Override
    public Server pingServer(String ipAddress) throws IOException {
        log.info("Pinging Server with ipAddress={}", ipAddress);
        Server server = serverRepository.findServerByIpAddress(ipAddress);
        InetAddress inetAddress = InetAddress.getByName(ipAddress);
        server.setStatus(inetAddress.isReachable(IS_REACHABLE_TIMEOUT_IN_MILLIS) ? SERVER_UP : SERVER_DOWN);
        serverRepository.save(server);
        return server;
    }

    @Override
    public Server pingServer(Long id) throws IOException {
        log.info("Pinging Server with id={}", id);
        Server server = serverRepository.findServerById(id).orElseThrow();
        InetAddress inetAddress = InetAddress.getByName(server.getIpAddress());
        server.setStatus(inetAddress.isReachable(IS_REACHABLE_TIMEOUT_IN_MILLIS) ? SERVER_UP : SERVER_DOWN);
        serverRepository.save(server);
        return server;
    }

    @Override
    public Collection<Server> pingAllServers() throws IOException, InterruptedException {
        log.info("Pinging All Servers");
        Collection<Server> servers = serverRepository.findAll();
        for(Server server : servers) {
            InetAddress inetAddress = InetAddress.getByName(server.getIpAddress());
            server.setStatus(inetAddress.isReachable(IS_REACHABLE_TIMEOUT_IN_MILLIS) ? SERVER_UP : SERVER_DOWN);
            serverRepository.save(server);
//            TimeUnit.MILLISECONDS.sleep(100);
        }
        return servers;
    }
}