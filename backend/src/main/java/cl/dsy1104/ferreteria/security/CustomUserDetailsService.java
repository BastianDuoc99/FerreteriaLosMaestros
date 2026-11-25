package cl.dsy1104.ferreteria.security;

import cl.dsy1104.ferreteria.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

  private final UsuarioRepository usuarioRepository;

  public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    return usuarioRepository
        .findByEmailIgnoreCase(email)
        .map(
            usuario ->
                User.withUsername(usuario.getEmail())
                    .password(usuario.getPassword())
                    .authorities("ROLE_" + usuario.getRol().name())
                    .build())
        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
  }
}
