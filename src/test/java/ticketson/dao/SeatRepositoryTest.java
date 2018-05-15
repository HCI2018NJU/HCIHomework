package ticketson.dao;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import ticketson.entity.Seat;

import java.util.List;

/**
 * Created by shea on 2018/3/14.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class SeatRepositoryTest {
    @Autowired
    SeatRepository seatRepository;

    @Test
    public void testIsAvailable(){
//        List<Seat> seats = seatRepository.findByPeriod_PidAndLayoutSid(14,1);
//        for (Seat seat:seats){
//            System.out.println(seat.toString());
//        }
    }
}
