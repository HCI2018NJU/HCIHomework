package ticketson.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import ticketson.model.ManagerStatisticsModel;

/**
 * Created by shea on 2018/3/20.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class ManagerServiceTest {
    @Autowired
    ManagerService managerService;
    @Test
    public void testStatistics(){
        ManagerStatisticsModel managerStatisticsModel = managerService.getStatistics();
        System.out.println(managerStatisticsModel);
    }
}
