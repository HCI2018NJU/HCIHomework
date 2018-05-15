package ticketson.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ticketson.entity.Ticket;

/**
 * Created by shea on 2018/2/7.
 */
@Repository
public interface TicketRepository extends JpaRepository<Ticket,Long> {

}
