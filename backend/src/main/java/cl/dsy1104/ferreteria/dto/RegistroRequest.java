package cl.dsy1104.ferreteria.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistroRequest(
    @NotBlank String run,
    @NotBlank String nombre,
    String apellidos,
    @NotBlank @Email String email,
    @NotBlank @Size(min = 4, max = 100) String password,
    String fechaNacimiento,
    String direccion,
    String region,
    String comuna,
    String tipoCliente,
    boolean cuentaCorriente,
    String codigoPromocional) {
}
