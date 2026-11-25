package cl.dsy1104.ferreteria.dto;

public record AuthResponse(
    Long id,
    String token,
    String email,
    String nombre,
    String rol,
    boolean cuentaCorriente) {
}
