package cl.dsy1104.ferreteria.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "usuarios",
    uniqueConstraints = {
      @UniqueConstraint(name = "uk_usuarios_email", columnNames = "email"),
      @UniqueConstraint(name = "uk_usuarios_run", columnNames = "run")
    })
public class Usuario {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "email", nullable = false, length = 150)
  private String email;

  @Column(name = "password", nullable = false, length = 255)
  private String password;

  @Column(name = "nombre", nullable = false, length = 100)
  private String nombre;

  @Column(name = "apellidos", length = 150)
  private String apellidos;

  @Column(name = "run", length = 20)
  private String run;

  @Column(name = "fecha_nacimiento", length = 20)
  private String fechaNacimiento;

  @Column(name = "direccion", length = 250)
  private String direccion;

  @Column(name = "region", length = 120)
  private String region;

  @Column(name = "comuna", length = 120)
  private String comuna;

  @Enumerated(EnumType.STRING)
  @Column(name = "rol", nullable = false, length = 20)
  private Rol rol;

  @Column(name = "cuenta_corriente_solicitada", nullable = false)
  private boolean cuentaCorrienteSolicitada;

  @Column(name = "cuenta_corriente_aprobada", nullable = false)
  private boolean cuentaCorrienteAprobada;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getNombre() {
    return nombre;
  }

  public void setNombre(String nombre) {
    this.nombre = nombre;
  }

  public String getApellidos() {
    return apellidos;
  }

  public void setApellidos(String apellidos) {
    this.apellidos = apellidos;
  }

  public String getRun() {
    return run;
  }

  public void setRun(String run) {
    this.run = run;
  }

  public String getFechaNacimiento() {
    return fechaNacimiento;
  }

  public void setFechaNacimiento(String fechaNacimiento) {
    this.fechaNacimiento = fechaNacimiento;
  }

  public String getDireccion() {
    return direccion;
  }

  public void setDireccion(String direccion) {
    this.direccion = direccion;
  }

  public String getRegion() {
    return region;
  }

  public void setRegion(String region) {
    this.region = region;
  }

  public String getComuna() {
    return comuna;
  }

  public void setComuna(String comuna) {
    this.comuna = comuna;
  }

  public Rol getRol() {
    return rol;
  }

  public void setRol(Rol rol) {
    this.rol = rol;
  }

  public boolean isCuentaCorrienteSolicitada() {
    return cuentaCorrienteSolicitada;
  }

  public void setCuentaCorrienteSolicitada(boolean cuentaCorrienteSolicitada) {
    this.cuentaCorrienteSolicitada = cuentaCorrienteSolicitada;
  }

  public boolean isCuentaCorrienteAprobada() {
    return cuentaCorrienteAprobada;
  }

  public void setCuentaCorrienteAprobada(boolean cuentaCorrienteAprobada) {
    this.cuentaCorrienteAprobada = cuentaCorrienteAprobada;
  }
}
