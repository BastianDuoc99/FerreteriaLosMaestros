package cl.dsy1104.ferreteria.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtService jwtService;
  private final UserDetailsService userDetailsService;

  public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
    this.jwtService = jwtService;
    this.userDetailsService = userDetailsService;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String autorizacion = request.getHeader("Authorization");

    if (autorizacion != null && autorizacion.startsWith("Bearer ")) {
      String token = autorizacion.substring(7);
      if (jwtService.esValido(token)) {
        String email = jwtService.extraerEmail(token);
        UserDetails usuario = userDetailsService.loadUserByUsername(email);
        UsernamePasswordAuthenticationToken autenticacion =
            new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());
        autenticacion.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(autenticacion);
      }
    }

    filterChain.doFilter(request, response);
  }
}
