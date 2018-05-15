package ticketson.dao;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import ticketson.entity.Order;

import javax.transaction.Transactional;
import java.util.List;

/**
 * Created by shea on 2018/3/14.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class OrderRepositoryTest {
    @Autowired
    OrderRepository orderRepository;

    private static final Logger logger = LoggerFactory.getLogger("OrderRepositoryTest");

    @Test
    public void getOrder(){
        long oid = 1;
        Order order = orderRepository.findOne(oid);
        logger.info(order.toString());
    }

    @Test
    @Transactional
    public void getOrders(){

    }

}
