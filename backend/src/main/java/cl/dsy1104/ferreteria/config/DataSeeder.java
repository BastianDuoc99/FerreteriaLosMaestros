package cl.dsy1104.ferreteria.config;

import cl.dsy1104.ferreteria.entity.Rol;
import cl.dsy1104.ferreteria.entity.Usuario;
import cl.dsy1104.ferreteria.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

  private final UsuarioRepository usuarioRepository;
  private final PasswordEncoder passwordEncoder;

  public DataSeeder(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
    this.usuarioRepository = usuarioRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public void run(String... args) {
    crearSiNoExiste("admin@duoc.cl", "1234", "Administrador", Rol.Administrador, "ADMIN-001", true);
    crearSiNoExiste("vendedor@duoc.cl", "1234", "Vendedor", Rol.Vendedor, "VENDEDOR-001", false);
    crearSiNoExiste("cliente@duoc.cl", "1234", "Cliente Demo", Rol.Contratista, "CLIENTE-001", true);
  }

  private void crearSiNoExiste(
      String email,
      String password,
      String nombre,
      Rol rol,
      String run,
      boolean cuentaCorriente) {
    if (usuarioRepository.existsByEmailIgnoreCase(email)) {
      return;
    }

    Usuario usuario = new Usuario();
    usuario.setEmail(email);
    usuario.setPassword(passwordEncoder.encode(password));
    usuario.setNombre(nombre);
    usuario.setApellidos("Ferretería Los Maestros");
    usuario.setRun(run);
    usuario.setRol(rol);
    usuario.setCuentaCorrienteSolicitada(cuentaCorriente);
    usuario.setCuentaCorrienteAprobada(cuentaCorriente);
    usuarioRepository.save(usuario);
  }
}
