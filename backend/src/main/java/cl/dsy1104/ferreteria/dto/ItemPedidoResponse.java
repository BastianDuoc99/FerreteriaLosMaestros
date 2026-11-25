package cl.dsy1104.ferreteria.dto;

import java.math.BigDecimal;

public record ItemPedidoResponse(
    String codigo,
    String nombre,
    String marca,
    String unidad,
    BigDecimal precio,
    int qty) {
}
