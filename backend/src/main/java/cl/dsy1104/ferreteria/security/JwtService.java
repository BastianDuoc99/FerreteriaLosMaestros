package cl.dsy1104.ferreteria.security;

import cl.dsy1104.ferreteria.entity.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtService {

  private final SecretKey key;
  private final long expirationMs;

  public JwtService(
      @Value("${jwt.secret}") String secret,
      @Value("${jwt.expiration-ms}") long expirationMs) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.expirationMs = expirationMs;
  }

  public String generarToken(Usuario usuario) {
    Date ahora = new Date();
    return Jwts.builder()
        .subject(usuario.getEmail())
        .claim("rol", usuario.getRol().name())
        .claim("nombre", usuario.getNombre())
        .issuedAt(ahora)
        .expiration(new Date(ahora.getTime() + expirationMs))
        .signWith(key)
        .compact();
  }

  public String extraerEmail(String token) {
    return parsear(token).getPayload().getSubject();
  }

  public String extraerRol(String token) {
    return parsear(token).getPayload().get("rol", String.class);
  }

  public boolean esValido(String token) {
    try {
      parsear(token);
      return true;
    } catch (JwtException | IllegalArgumentException ex) {
      return false;
    }
  }

  private Jws<Claims> parsear(String token) {
    return Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
  }
}
