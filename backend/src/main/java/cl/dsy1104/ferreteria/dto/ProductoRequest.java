package cl.dsy1104.ferreteria.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public record ProductoRequest(
    @NotBlank String codigo,
    @NotBlank String categoria,
    String subcategoria,
    @NotBlank String nombre,
    String marca,
    String unidad,
    @DecimalMin("0") BigDecimal precioCompra,
    @DecimalMin("0.01") BigDecimal precio,
    @Min(0) int stock,
    @Min(0) int stockMinimo,
    String descripcion,
    String imagen,
    String tipo) {
}
