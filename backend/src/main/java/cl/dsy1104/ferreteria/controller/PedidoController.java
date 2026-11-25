package cl.dsy1104.ferreteria.controller;

import cl.dsy1104.ferreteria.dto.PedidoRequest;
import cl.dsy1104.ferreteria.dto.PedidoResponse;
import cl.dsy1104.ferreteria.service.PedidoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

  private final PedidoService pedidoService;

  public PedidoController(PedidoService pedidoService) {
    this.pedidoService = pedidoService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public PedidoResponse crear(
      @AuthenticationPrincipal UserDetails usuario, @Valid @RequestBody PedidoRequest solicitud) {
    return pedidoService.crear(usuario.getUsername(), solicitud);
  }

  @GetMapping("/mios")
  public List<PedidoResponse> mios(@AuthenticationPrincipal UserDetails usuario) {
    return pedidoService.listarMios(usuario.getUsername());
  }

  @GetMapping
  @PreAuthorize("hasRole('Administrador')")
  public List<PedidoResponse> todos() {
    return pedidoService.listarTodos();
  }
}
