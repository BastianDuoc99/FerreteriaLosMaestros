package cl.dsy1104.ferreteria.exception;

import cl.dsy1104.ferreteria.dto.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.stream.Collectors;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ApiException.class)
  public ResponseEntity<ApiError> manejarApi(ApiException ex, HttpServletRequest request) {
    return construir(ex.getStatus(), ex.getMessage(), request);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> manejarValidacion(
      MethodArgumentNotValidException ex, HttpServletRequest request) {
    String mensaje =
        ex.getBindingResult().getFieldErrors().stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .collect(Collectors.joining("; "));
    return construir(HttpStatus.BAD_REQUEST, mensaje, request);
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ApiError> manejarIntegridad(
      DataIntegrityViolationException ex, HttpServletRequest request) {
    return construir(HttpStatus.CONFLICT, "El registro ya existe o viola una restricción de datos.", request);
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ApiError> manejarAcceso(
      AccessDeniedException ex, HttpServletRequest request) {
    return construir(HttpStatus.FORBIDDEN, "No tienes permisos para realizar esta acción.", request);
  }

  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<ApiError> manejarAutenticacion(
      AuthenticationException ex, HttpServletRequest request) {
    return construir(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos.", request);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiError> manejarGeneral(Exception ex, HttpServletRequest request) {
    return construir(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor.", request);
  }

  private ResponseEntity<ApiError> construir(
      HttpStatus status, String message, HttpServletRequest request) {
    ApiError error =
        new ApiError(
            Instant.now(),
            status.value(),
            status.getReasonPhrase(),
            message,
            request.getRequestURI());
    return ResponseEntity.status(status).body(error);
  }
}
