package cl.dsy1104.ferreteria.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record PedidoRequest(
    @NotEmpty List<@Valid ItemPedidoRequest> items,
    @NotBlank String entrega,
    @NotBlank String pago,
    String direccion) {
}
