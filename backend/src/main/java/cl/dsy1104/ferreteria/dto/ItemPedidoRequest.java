package cl.dsy1104.ferreteria.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ItemPedidoRequest(@NotBlank String codigo, @Min(1) int qty) {
}
