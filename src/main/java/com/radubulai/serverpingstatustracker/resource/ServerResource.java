package com.radubulai.serverpingstatustracker.resource;

import com.radubulai.serverpingstatustracker.model.Response;
import com.radubulai.serverpingstatustracker.model.Server;
import com.radubulai.serverpingstatustracker.service.implementation.ServerServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.util.Map;

import static com.radubulai.serverpingstatustracker.enumeration.Status.*;
import static java.time.LocalDateTime.*;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

/**
 * @author Radu-Alexandru Bulai (<a href="https://radubulai.com">https://radubulai.com</a>)
 * @version 1.0
 * @since 08/07/2023
 */
@RestController
@RequestMapping("/api/servers")
@RequiredArgsConstructor
public class ServerResource {
    private final ServerServiceImpl serverService;

    @GetMapping("")
    public ResponseEntity<Response> getAllServers() {
        return ResponseEntity.ok(
                Response.builder()
                        .timeStamp(now())
                        .data(Map.of("servers", serverService.findAllServers()))
                        .message("Servers retrieved")
                        .status(OK)
                        .statusCode(OK.value())
                        .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getServerById(@PathVariable Long id) {
        return ResponseEntity.ok(
                Response.builder()
                        .timeStamp(now())
                        .data(Map.of("server", serverService.findServerById(id)))
                        .message("Server retrieved")
                        .status(OK)
                        .statusCode(OK.value())
                        .build());
    }

    @PostMapping("")
    public ResponseEntity<Response> addServer(@RequestBody @Valid Server server) {
        return ResponseEntity.ok(
                Response.builder()
                        .timeStamp(now())
                        .data(Map.of("server", serverService.addServer(server)))
                        .message("Server created")
                        .status(CREATED)
                        .statusCode(CREATED.value())
                        .build());
    }

    @PostMapping("/save-all")
    public ResponseEntity<Response> addServers(@RequestBody @Valid Server[] servers) {
        return ResponseEntity.ok(
                Response.builder()
                        .timeStamp(now())
                        .data(Map.of("servers", serverService.addServers(servers)))
                        .message(String.format("%s Servers created", servers.length))
                        .status(CREATED)
                        .statusCode(CREATED.value())
                        .build());
    }

    @PutMapping("")
    public ResponseEntity<Response> updateServer(@RequestBody @Valid Server server) {
        return ResponseEntity.ok(
                Response.builder()
                        .timeStamp(now())
                        .data(Map.of("server", serverService.updateServer(server)))
                        .message("Server updated")
                        .status(OK)
                        .statusCode(OK.value())
                        .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Response> deleteServerById(@PathVariable Long id) {
        return ResponseEntity.ok(
                Response.builder()
                        .timeStamp(now())
                        .data(Map.of("deleted", serverService.deleteServerById(id)))
                        .message("Server deleted")
                        .status(OK)
                        .statusCode(OK.value())
                        .build());
    }

    @DeleteMapping("/delete-all")
    public ResponseEntity<Response> deleteAllServers() {
        return ResponseEntity.ok(
                Response.builder()
                        .timeStamp(now())
                        .data(Map.of("deleted", serverService.deleteAllServers()))
                        .message("All Servers deleted")
                        .status(OK)
                        .statusCode(OK.value())
                        .build());
    }

    @GetMapping("/ping/{ipAddress}")
    public ResponseEntity<Response> pingServer(
            @PathVariable("ipAddress") String ipAddress) throws IOException {
        Server server = serverService.pingServer(ipAddress);
        return ResponseEntity.ok(
                Response.builder()
                        .timeStamp(now())
                        .data(Map.of("server", server))
                        .message(server.getStatus() == SERVER_UP ? "Ping success" : "Ping failed")
                        .status(OK)
                        .statusCode(OK.value())
                        .build());
    }

    @GetMapping("/{id}/ping")
    public ResponseEntity<Response> pingServer(
            @PathVariable("id") Long id) throws IOException {
        Server server = serverService.pingServer(id);
        return ResponseEntity.ok(
                Response.builder()
                        .timeStamp(now())
                        .data(Map.of("server", server))
                        .message(server.getStatus() == SERVER_UP ? "Ping success" : "Ping failed")
                        .status(OK)
                        .statusCode(OK.value())
                        .build());
    }

    @GetMapping("/ping")
    public ResponseEntity<Response> getAllServersPinged() throws IOException, InterruptedException {
        return ResponseEntity.ok(
                Response.builder()
                        .timeStamp(now())
                        .data(Map.of("servers", serverService.pingAllServers()))
                        .message("Servers pinged and retrieved")
                        .status(OK)
                        .statusCode(OK.value())
                        .build());
    }
}