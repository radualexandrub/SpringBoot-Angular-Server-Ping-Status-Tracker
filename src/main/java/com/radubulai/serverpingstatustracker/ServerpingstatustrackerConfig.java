package com.radubulai.serverpingstatustracker;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "serverpingstatustracker-config")
public class ServerpingstatustrackerConfig {
    private static int isReachableTimeoutInMillis;

    public static int getIsReachableTimeoutInMillis() {
        return isReachableTimeoutInMillis;
    }

    public void setIsReachableTimeoutInMillis(int isReachableTimeoutInMillis) {
        ServerpingstatustrackerConfig.isReachableTimeoutInMillis = isReachableTimeoutInMillis;
    }
}
