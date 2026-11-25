package cl.dsy1104.ferreteria.repository;

import cl.dsy1104.ferreteria.entity.Contacto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactoRepository extends JpaRepository<Contacto, Long> {
}
