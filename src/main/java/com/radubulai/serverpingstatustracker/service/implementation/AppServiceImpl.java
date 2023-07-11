package com.radubulai.serverpingstatustracker.service.implementation;

import com.radubulai.serverpingstatustracker.enumeration.Status;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.net.InetAddress;

import static com.radubulai.serverpingstatustracker.enumeration.Status.SERVER_DOWN;
import static com.radubulai.serverpingstatustracker.enumeration.Status.SERVER_UP;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AppServiceImpl {
    int IS_REACHABLE_TIMEOUT_IN_MILLIS = 10000;
    public Status pingServerOnly(String ipAddress) throws IOException {
        log.info("Pinging Server with ipAddress={}", ipAddress);
        InetAddress inetAddress = InetAddress.getByName(ipAddress);
        return inetAddress.isReachable(IS_REACHABLE_TIMEOUT_IN_MILLIS) ? SERVER_UP : SERVER_DOWN;
    }
}
