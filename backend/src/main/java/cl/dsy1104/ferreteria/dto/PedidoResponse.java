package cl.dsy1104.ferreteria.dto;

import java.math.BigDecimal;
import java.util.List;

public record PedidoResponse(
    String id,
    String fecha,
    String estado,
    String usuario,
    String nombre,
    List<ItemPedidoResponse> items,
    BigDecimal total,
    String entrega,
    String pago,
    String direccion) {
}
