package cl.dsy1104.ferreteria.controller;

import cl.dsy1104.ferreteria.dto.UsuarioResponse;
import cl.dsy1104.ferreteria.service.UsuarioService;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
@PreAuthorize("hasRole('Administrador')")
public class UsuarioController {

  private final UsuarioService usuarioService;

  public UsuarioController(UsuarioService usuarioService) {
    this.usuarioService = usuarioService;
  }

  @GetMapping
  public List<UsuarioResponse> listar() {
    return usuarioService.listar();
  }

  @PutMapping("/{id}/cuenta-corriente")
  public UsuarioResponse cambiarCuentaCorriente(
      @PathVariable Long id, @RequestParam boolean aprobada) {
    return usuarioService.cambiarCuentaCorriente(id, aprobada);
  }
}
