package ticketson.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ticketson.entity.Seat;

import java.util.List;

/**
 * Created by shea on 2018/2/8.
 */
@Repository
public interface SeatRepository extends JpaRepository<Seat,Long> {
    Seat findByPeriod_PidAndLayoutSid(long pid,int layoutSid);

//    List<Seat> findByPeriod_PidAndLayoutSid(long pid,int layoutSid);

    Integer countByPeriod_PidAndLevel(long pid,int level);

    List<Seat> findByPeriod_PidAndLevelAndIsAvailable(long pid,int level,boolean isAvailable);
}
