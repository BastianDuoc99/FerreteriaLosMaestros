package cl.dsy1104.ferreteria.controller;

import cl.dsy1104.ferreteria.dto.AuthResponse;
import cl.dsy1104.ferreteria.dto.LoginRequest;
import cl.dsy1104.ferreteria.dto.RegistroRequest;
import cl.dsy1104.ferreteria.dto.UsuarioResponse;
import cl.dsy1104.ferreteria.service.AuthService;
import cl.dsy1104.ferreteria.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;
  private final UsuarioService usuarioService;

  public AuthController(AuthService authService, UsuarioService usuarioService) {
    this.authService = authService;
    this.usuarioService = usuarioService;
  }

  @PostMapping("/registro")
  @ResponseStatus(HttpStatus.CREATED)
  public UsuarioResponse registro(@Valid @RequestBody RegistroRequest solicitud) {
    return usuarioService.registrar(solicitud);
  }

  @PostMapping("/login")
  public AuthResponse login(@Valid @RequestBody LoginRequest solicitud) {
    return authService.login(solicitud);
  }

  @GetMapping("/me")
  public UsuarioResponse perfil(@AuthenticationPrincipal UserDetails usuario) {
    return usuarioService.obtenerPorEmail(usuario.getUsername());
  }
}
