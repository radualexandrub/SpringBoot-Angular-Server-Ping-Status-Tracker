package com.radubulai.serverpingstatustracker.exception;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public class ApiException {
    private final LocalDateTime timeStamp;
    private final int statusCode;
    private final HttpStatus status;
    private final String reason;
    private final String message;
    private final String developerMessage;

    public ApiException(LocalDateTime timeStamp,
                        int statusCode,
                        HttpStatus status,
                        String reason,
                        String message,
                        String developerMessage) {
        this.timeStamp = timeStamp;
        this.statusCode = statusCode;
        this.status = status;
        this.reason = reason;
        this.message = message;
        this.developerMessage = developerMessage;
    }

    public LocalDateTime getTimeStamp() {
        return timeStamp;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getReason() {
        return reason;
    }

    public String getMessage() {
        return message;
    }

    public String getDeveloperMessage() {
        return developerMessage;
    }
}
