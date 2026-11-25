package cl.dsy1104.ferreteria.service;

import cl.dsy1104.ferreteria.dto.AuthResponse;
import cl.dsy1104.ferreteria.dto.LoginRequest;
import cl.dsy1104.ferreteria.entity.Usuario;
import cl.dsy1104.ferreteria.exception.ApiException;
import cl.dsy1104.ferreteria.repository.UsuarioRepository;
import cl.dsy1104.ferreteria.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

  private final AuthenticationManager authenticationManager;
  private final UsuarioRepository usuarioRepository;
  private final JwtService jwtService;

  public AuthService(
      AuthenticationManager authenticationManager,
      UsuarioRepository usuarioRepository,
      JwtService jwtService) {
    this.authenticationManager = authenticationManager;
    this.usuarioRepository = usuarioRepository;
    this.jwtService = jwtService;
  }

  public AuthResponse login(LoginRequest solicitud) {
    Authentication autenticacion =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                solicitud.email().trim().toLowerCase(), solicitud.password()));

    Usuario usuario =
        usuarioRepository
            .findByEmailIgnoreCase(autenticacion.getName())
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas."));

    return new AuthResponse(
        usuario.getId(),
        jwtService.generarToken(usuario),
        usuario.getEmail(),
        usuario.getNombre(),
        usuario.getRol().name(),
        usuario.isCuentaCorrienteAprobada());
  }
}
