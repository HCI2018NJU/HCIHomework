package ticketson.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ticketson.entity.Bank;

/**
 * Created by shea on 2018/2/9.
 */
@Repository
public interface BankRepository extends JpaRepository<Bank,Long> {
}
