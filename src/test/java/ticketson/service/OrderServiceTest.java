package ticketson.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import ticketson.model.ConfirmOrderModel;
import ticketson.model.SimpleOrderModel;

import javax.transaction.Transactional;
import java.util.List;

/**
 * Created by shea on 2018/3/14.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class OrderServiceTest {
    @Autowired
    OrderService orderService;

    @Test
    @Transactional
    public void testGetOrder(){
        ConfirmOrderModel confirmOrderModel = orderService.getConfirmOrder(1);
//        System.out.println(confirmOrderModel.toString());
    }

    @Test
    @Transactional
    public void testGetMyOrders(){
        List<SimpleOrderModel> simpleOrderModels = orderService.getMyOrders(1,0,10,false);
        System.out.println(simpleOrderModels);
//        System.out.println(confirmOrderModel.toString());
    }
}
