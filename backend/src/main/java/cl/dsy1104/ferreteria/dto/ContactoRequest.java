package cl.dsy1104.ferreteria.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ContactoRequest(
    @NotBlank String nombre,
    @NotBlank @Email String email,
    @NotBlank String mensaje) {
}
