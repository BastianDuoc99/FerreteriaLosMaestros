package cl.dsy1104.ferreteria.service;

import cl.dsy1104.ferreteria.dto.ItemPedidoRequest;
import cl.dsy1104.ferreteria.dto.ItemPedidoResponse;
import cl.dsy1104.ferreteria.dto.PedidoRequest;
import cl.dsy1104.ferreteria.dto.PedidoResponse;
import cl.dsy1104.ferreteria.entity.Pedido;
import cl.dsy1104.ferreteria.entity.PedidoDetalle;
import cl.dsy1104.ferreteria.entity.Producto;
import cl.dsy1104.ferreteria.entity.Usuario;
import cl.dsy1104.ferreteria.exception.ApiException;
import cl.dsy1104.ferreteria.repository.PedidoRepository;
import cl.dsy1104.ferreteria.repository.ProductoRepository;
import cl.dsy1104.ferreteria.repository.UsuarioRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class PedidoService {

  private final PedidoRepository pedidoRepository;
  private final ProductoRepository productoRepository;
  private final UsuarioRepository usuarioRepository;

  public PedidoService(
      PedidoRepository pedidoRepository,
      ProductoRepository productoRepository,
      UsuarioRepository usuarioRepository) {
    this.pedidoRepository = pedidoRepository;
    this.productoRepository = productoRepository;
    this.usuarioRepository = usuarioRepository;
  }

  @Transactional
  public PedidoResponse crear(String email, PedidoRequest solicitud) {
    Usuario usuario =
        usuarioRepository
            .findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Debes iniciar sesión."));

    String entrega = solicitud.entrega() == null ? "" : solicitud.entrega().trim();
    String pago = solicitud.pago() == null ? "" : solicitud.pago().trim();
    String direccion = solicitud.direccion() == null ? "" : solicitud.direccion().trim();

    if (!entrega.equals("retiro") && !entrega.equals("despacho")) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Tipo de entrega no válido.");
    }
    if (!pago.equals("contado") && !pago.equals("cuenta-corriente")) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Forma de pago no válida.");
    }
    if (entrega.equals("despacho") && direccion.isEmpty()) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "La dirección de despacho es obligatoria.");
    }
    if (pago.equals("cuenta-corriente") && !usuario.isCuentaCorrienteAprobada()) {
      throw new ApiException(
          HttpStatus.FORBIDDEN, "Tu cuenta corriente no está aprobada para comprar a crédito.");
    }
    if (solicitud.items() == null || solicitud.items().isEmpty()) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "El pedido no contiene productos.");
    }

    Pedido pedido = new Pedido();
    pedido.setId(generarId());
    pedido.setUsuario(usuario);
    pedido.setFecha(LocalDateTime.now());
    pedido.setEstado("Registrado");
    pedido.setEntrega(entrega);
    pedido.setPago(pago);
    pedido.setDireccion(entrega.equals("despacho") ? direccion : "");

    List<ItemPedidoResponse> respuestaItems = new ArrayList<>();
    Set<String> codigosVistos = new HashSet<>();
    BigDecimal total = BigDecimal.ZERO;

    for (ItemPedidoRequest item : solicitud.items()) {
      String codigo = item.codigo() == null ? "" : item.codigo().trim();
      if (!codigosVistos.add(codigo)) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "Producto duplicado: " + codigo);
      }

      Producto producto =
          productoRepository
              .findByCodigoForUpdate(codigo)
              .orElseThrow(
                  () -> new ApiException(HttpStatus.NOT_FOUND, "Producto no encontrado: " + codigo));

      if (producto.getStock() < item.qty()) {
        throw new ApiException(
            HttpStatus.CONFLICT,
            "Stock insuficiente para " + producto.getNombre() + ". Disponible: " + producto.getStock());
      }

      producto.setStock(producto.getStock() - item.qty());
      productoRepository.save(producto);

      BigDecimal subtotal = producto.getPrecio().multiply(BigDecimal.valueOf(item.qty()));
      total = total.add(subtotal);

      PedidoDetalle detalle = new PedidoDetalle();
      detalle.setPedido(pedido);
      detalle.setCodigoProducto(producto.getCodigo());
      detalle.setNombre(producto.getNombre());
      detalle.setMarca(producto.getMarca());
      detalle.setUnidad(producto.getUnidad());
      detalle.setPrecioUnitario(producto.getPrecio());
      detalle.setCantidad(item.qty());
      detalle.setSubtotal(subtotal);
      pedido.getItems().add(detalle);

      respuestaItems.add(
          new ItemPedidoResponse(
              producto.getCodigo(),
              producto.getNombre(),
              producto.getMarca(),
              producto.getUnidad(),
              producto.getPrecio(),
              item.qty()));
    }

    pedido.setTotal(total);
    Pedido guardado = pedidoRepository.save(pedido);
    return aResponse(guardado, respuestaItems);
  }

  public List<PedidoResponse> listarMios(String email) {
    Usuario usuario =
        usuarioRepository
            .findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
    return pedidoRepository.findAllByUsuarioIdOrderByFechaDesc(usuario.getId()).stream()
        .map(this::aResponse)
        .toList();
  }

  public List<PedidoResponse> listarTodos() {
    return pedidoRepository.findAll().stream().map(this::aResponse).toList();
  }

  private PedidoResponse aResponse(Pedido pedido) {
    List<ItemPedidoResponse> items =
        pedido.getItems().stream()
            .map(
                detalle ->
                    new ItemPedidoResponse(
                        detalle.getCodigoProducto(),
                        detalle.getNombre(),
                        detalle.getMarca(),
                        detalle.getUnidad(),
                        detalle.getPrecioUnitario(),
                        detalle.getCantidad()))
            .toList();
    return aResponse(pedido, items);
  }

  private PedidoResponse aResponse(Pedido pedido, List<ItemPedidoResponse> items) {
    return new PedidoResponse(
        pedido.getId(),
        pedido.getFecha().toString(),
        pedido.getEstado(),
        pedido.getUsuario().getEmail(),
        pedido.getUsuario().getNombre(),
        items,
        pedido.getTotal(),
        pedido.getEntrega(),
        pedido.getPago(),
        pedido.getDireccion());
  }

  private String generarId() {
    long timestamp = System.currentTimeMillis();
    String aleatorio = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    return "PED-" + timestamp + "-" + aleatorio;
  }
}
