package ticketson.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ticketson.entity.Period;

import java.util.List;

/**
 * Created by shea on 2018/2/7.
 */
@Repository
public interface PeriodRepository extends JpaRepository<Period,Long> {
    List<Period> findByActivity_Aid(long aid);
}
