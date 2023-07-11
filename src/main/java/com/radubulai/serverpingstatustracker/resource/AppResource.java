package com.radubulai.serverpingstatustracker.resource;

import com.radubulai.serverpingstatustracker.enumeration.Status;
import com.radubulai.serverpingstatustracker.model.Response;
import com.radubulai.serverpingstatustracker.model.Server;
import com.radubulai.serverpingstatustracker.service.implementation.AppServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

import static com.radubulai.serverpingstatustracker.enumeration.Status.SERVER_UP;
import static java.time.LocalDateTime.now;
import static org.springframework.http.HttpStatus.OK;

/**
 * @author Radu-Alexandru Bulai (<a href="https://radubulai.com">https://radubulai.com</a>)
 * @version 1.0
 * @since 10/07/2023
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AppResource {
    private final AppServiceImpl appService;

    @GetMapping("/ping/{ipAddress}")
    public ResponseEntity<Response> pingServerOnly(
            @PathVariable("ipAddress") String ipAddress) throws IOException {
        Status serverStatus = appService.pingServerOnly(ipAddress);
        Server server = new Server();
        server.setIpAddress(ipAddress);
        server.setStatus(serverStatus);
        return ResponseEntity.ok(
                Response.builder()
                        .timeStamp(now())
                        .data(Map.of("server", server))
                        .message(serverStatus == SERVER_UP ? "Ping success" : "Ping failed")
                        .status(OK)
                        .statusCode(OK.value())
                        .build());
    }
}
