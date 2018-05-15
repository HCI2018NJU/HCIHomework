package ticketson.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import ticketson.entity.Manager;

/**
 * Created by shea on 2018/3/13.
 */
public interface ManagerRepository extends JpaRepository<Manager,String> {

}
