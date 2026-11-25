package cl.dsy1104.ferreteria.service;

import cl.dsy1104.ferreteria.dto.RegistroRequest;
import cl.dsy1104.ferreteria.dto.UsuarioResponse;
import cl.dsy1104.ferreteria.entity.Rol;
import cl.dsy1104.ferreteria.entity.Usuario;
import cl.dsy1104.ferreteria.exception.ApiException;
import cl.dsy1104.ferreteria.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

  private final UsuarioRepository usuarioRepository;
  private final PasswordEncoder passwordEncoder;

  public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
    this.usuarioRepository = usuarioRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Transactional
  public UsuarioResponse registrar(RegistroRequest solicitud) {
    String email = solicitud.email().trim().toLowerCase();
    String run = solicitud.run() == null ? "" : solicitud.run().trim();

    if (usuarioRepository.existsByEmailIgnoreCase(email)) {
      throw new ApiException(HttpStatus.CONFLICT, "El correo ya está registrado.");
    }
    if (!run.isEmpty() && usuarioRepository.existsByRunIgnoreCase(run)) {
      throw new ApiException(HttpStatus.CONFLICT, "El RUN ya está registrado.");
    }

    Rol rol = determinarRol(solicitud.tipoCliente());

    Usuario usuario = new Usuario();
    usuario.setEmail(email);
    usuario.setPassword(passwordEncoder.encode(solicitud.password()));
    usuario.setNombre(solicitud.nombre().trim());
    usuario.setApellidos(solicitud.apellidos());
    usuario.setRun(run);
    usuario.setFechaNacimiento(solicitud.fechaNacimiento());
    usuario.setDireccion(solicitud.direccion());
    usuario.setRegion(solicitud.region());
    usuario.setComuna(solicitud.comuna());
    usuario.setRol(rol);
    usuario.setCuentaCorrienteSolicitada(
        rol == Rol.Contratista && Boolean.TRUE.equals(solicitud.cuentaCorriente()));
    usuario.setCuentaCorrienteAprobada(false);

    return aResponse(usuarioRepository.save(usuario));
  }

  @Transactional(readOnly = true)
  public UsuarioResponse obtenerPorEmail(String email) {
    return usuarioRepository
        .findByEmailIgnoreCase(email)
        .map(UsuarioService::aResponse)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
  }

  @Transactional(readOnly = true)
  public java.util.List<UsuarioResponse> listar() {
    return usuarioRepository.findAll().stream().map(UsuarioService::aResponse).toList();
  }

  @Transactional
  public UsuarioResponse cambiarCuentaCorriente(Long id, boolean aprobada) {
    Usuario usuario =
        usuarioRepository
            .findById(id)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
    usuario.setCuentaCorrienteAprobada(aprobada);
    if (aprobada) {
      usuario.setCuentaCorrienteSolicitada(true);
    }
    return aResponse(usuarioRepository.save(usuario));
  }

  private Rol determinarRol(String tipoCliente) {
    if (tipoCliente == null || tipoCliente.isBlank()) {
      return Rol.Contratista;
    }
    if ("Contratista".equalsIgnoreCase(tipoCliente)) {
      return Rol.Contratista;
    }
    if ("Particular".equalsIgnoreCase(tipoCliente)) {
      return Rol.Particular;
    }
    throw new ApiException(
        HttpStatus.BAD_REQUEST, "Tipo de cliente no válido en el registro público.");
  }

  public static UsuarioResponse aResponse(Usuario usuario) {
    return new UsuarioResponse(
        usuario.getId(),
        usuario.getEmail(),
        usuario.getNombre(),
        usuario.getApellidos(),
        usuario.getRun(),
        usuario.getRol().name(),
        usuario.isCuentaCorrienteAprobada(),
        usuario.isCuentaCorrienteSolicitada());
  }
}
