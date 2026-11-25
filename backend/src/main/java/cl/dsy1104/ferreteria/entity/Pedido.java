package cl.dsy1104.ferreteria.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
public class Pedido {

  @Id
  @Column(name = "id", nullable = false, length = 40)
  private String id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "usuario_id", nullable = false)
  private Usuario usuario;

  @Column(name = "fecha", nullable = false)
  private LocalDateTime fecha;

  @Column(name = "estado", nullable = false, length = 40)
  private String estado;

  @Column(name = "entrega", nullable = false, length = 30)
  private String entrega;

  @Column(name = "pago", nullable = false, length = 30)
  private String pago;

  @Column(name = "direccion", length = 250)
  private String direccion;

  @Column(name = "total", nullable = false, precision = 12, scale = 2)
  private BigDecimal total;

  @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<PedidoDetalle> items = new ArrayList<>();

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public Usuario getUsuario() {
    return usuario;
  }

  public void setUsuario(Usuario usuario) {
    this.usuario = usuario;
  }

  public LocalDateTime getFecha() {
    return fecha;
  }

  public void setFecha(LocalDateTime fecha) {
    this.fecha = fecha;
  }

  public String getEstado() {
    return estado;
  }

  public void setEstado(String estado) {
    this.estado = estado;
  }

  public String getEntrega() {
    return entrega;
  }

  public void setEntrega(String entrega) {
    this.entrega = entrega;
  }

  public String getPago() {
    return pago;
  }

  public void setPago(String pago) {
    this.pago = pago;
  }

  public String getDireccion() {
    return direccion;
  }

  public void setDireccion(String direccion) {
    this.direccion = direccion;
  }

  public BigDecimal getTotal() {
    return total;
  }

  public void setTotal(BigDecimal total) {
    this.total = total;
  }

  public List<PedidoDetalle> getItems() {
    return items;
  }

  public void setItems(List<PedidoDetalle> items) {
    this.items = items;
  }
}
