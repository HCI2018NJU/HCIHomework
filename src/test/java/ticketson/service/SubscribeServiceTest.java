package ticketson.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import ticketson.model.UnsubscribeModel;

import javax.transaction.Transactional;

/**
 * Created by shea on 2018/3/20.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class SubscribeServiceTest {

    @Autowired
    SubscribeService subscribeService;

    @Test
    @Transactional
    public void testSchedule() {
        subscribeService.allocateTickets();
    }

    @Test
    @Transactional
    public void testUnsubscribe(){
        UnsubscribeModel unsubscribeModel = subscribeService.unsubscribe(13);
        System.out.println(unsubscribeModel);
    }
}
