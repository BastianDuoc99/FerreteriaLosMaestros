package cl.dsy1104.ferreteria.dto;

public record UsuarioResponse(
    Long id,
    String email,
    String nombre,
    String apellidos,
    String run,
    String rol,
    boolean cuentaCorriente,
    boolean cuentaCorrienteSolicitada) {
}
