package ticketson.dao;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.junit4.SpringRunner;
import ticketson.entity.Activity;
import ticketson.entity.Period;

import java.util.List;

/**
 * Created by shea on 2018/3/14.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class ActivityRepositoryTest {
    @Autowired
    ActivityRepository activityRepository;

    @Autowired
    PeriodRepository periodRepository;

    private static final Logger logger = LoggerFactory.getLogger("ActivityRepositoryTest");

    @Test
    public void clear(){
        activityRepository.deleteAll();
        periodRepository.deleteAll();
    }

    @Test
    public void testCountActivitiesTotalNum(){
        long now = System.currentTimeMillis();
        int count = activityRepository.countByEndSellGreaterThan(now);
        List<Activity> activities = activityRepository.findAll();

        for(Activity activity:activities){
            logger.info(activity.getEndSell()+"");
            logger.info(String.valueOf(activity.getEndSell()>now));
        }
        logger.info(count+"");
    }

    @Test
    public void testGetActivitiesByVid(){
        long now = System.currentTimeMillis();
        Pageable pageable = new PageRequest(0,10, Sort.Direction.DESC,"endSell");
        System.out.println(now<1521129600000l);
        Page<Activity> activityPage = activityRepository.findByVenue_VidAndBeginLessThanAndEndGreaterThan("n222l6B",now,now,pageable);
        Page<Activity> activityPage1 = activityRepository.findByVenue_VidAndBeginGreaterThan("n222l6B",now,pageable);
        Page<Activity> activityPage2 = activityRepository.findByVenue_VidAndEndGreaterThan("n222l6B",now,pageable);
        System.out.println(activityPage.getContent());
        System.out.println(activityPage1.getContent());
        System.out.println(activityPage2.getContent());
    }
}
