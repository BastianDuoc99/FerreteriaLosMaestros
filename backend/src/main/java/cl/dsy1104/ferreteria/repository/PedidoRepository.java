package cl.dsy1104.ferreteria.repository;

import cl.dsy1104.ferreteria.entity.Pedido;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, String> {

  List<Pedido> findAllByUsuarioIdOrderByFechaDesc(Long usuarioId);
}
