package ticketson.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import ticketson.model.ActivityModel;
import ticketson.model.ActivityStatisticsModel;

import javax.transaction.Transactional;
import java.util.List;

/**
 * Created by shea on 2018/3/14.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class ActivityServiceTest {
    @Autowired
    ActivityService activityService;

    @Test
    @Transactional
    public void testGetActivitiesByVid(){
        List<ActivityModel> activityModels = activityService.getActivitiesByVid("n222l6B",1,0,10);
        System.out.println(activityModels);
    }

    @Test
    @Transactional
    public void testGetStatistics(){
        List<ActivityStatisticsModel> activityStatisticsModels = activityService.getStatistics("n222l6B",0,10);
        System.out.println(activityStatisticsModels);
    }
}
