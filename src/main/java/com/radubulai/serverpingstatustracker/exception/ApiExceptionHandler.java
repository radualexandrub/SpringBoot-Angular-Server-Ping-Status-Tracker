package com.radubulai.serverpingstatustracker.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.net.UnknownHostException;
import java.sql.SQLIntegrityConstraintViolationException;

import static java.time.LocalDateTime.now;

/**
 * @author Radu-Alexandru Bulai (<a href="https://radubulai.com">https://radubulai.com</a>)
 * @version 1.0
 * @since 03-Feb-2024
 */
@Slf4j
@ControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(value = {ServerNotFoundException.class})
    public ResponseEntity<Object> handleServerNotFoundException(ServerNotFoundException e) {
        HttpStatus notFound = HttpStatus.NOT_FOUND;
        ApiException apiException = new ApiException(
                now(),
                notFound.value(),
                notFound,
                "ServerNotFoundException",
                e.getMessage(),
                e.toString()
        );
        log.error(e.toString());
        return new ResponseEntity<>(apiException, notFound);
    }

    @ExceptionHandler(value = {UnknownHostException.class})
    public ResponseEntity<Object> handleUnknownHostException(UnknownHostException e) {
        HttpStatus httpStatus = HttpStatus.BAD_REQUEST;
        ApiException apiException = new ApiException(
                now(),
                httpStatus.value(),
                httpStatus,
                "UnknownHostException",
                e.getMessage(),
                e.toString()
        );
        log.error(e.toString());
        e.printStackTrace();
        return new ResponseEntity<>(apiException, httpStatus);
    }

    @ExceptionHandler(value = {SQLIntegrityConstraintViolationException.class})
    public ResponseEntity<Object> handleSQLIntegrityConstraintViolationException(
            SQLIntegrityConstraintViolationException e) {
        HttpStatus httpStatus = HttpStatus.BAD_REQUEST;
        ApiException apiException = new ApiException(
                now(),
                httpStatus.value(),
                httpStatus,
                "SQLIntegrityConstraintViolationException",
                e.getMessage(),
                e.toString()
        );
        log.error(e.toString());
        e.printStackTrace();
        return new ResponseEntity<>(apiException, httpStatus);
    }
}
