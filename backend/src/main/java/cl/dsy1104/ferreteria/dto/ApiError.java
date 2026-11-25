package cl.dsy1104.ferreteria.dto;

import java.time.Instant;

public record ApiError(
    Instant timestamp,
    int status,
    String error,
    String message,
    String path) {
}
