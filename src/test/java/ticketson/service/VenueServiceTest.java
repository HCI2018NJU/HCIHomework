package ticketson.service;

import com.alibaba.fastjson.JSON;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import ticketson.model.VenueStatisticsModel;

/**
 * Created by shea on 2018/2/6.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class VenueServiceTest {
    @Autowired
    private VenueService venueService;
    @Test
    public void register() throws Exception {
//        System.out.println(JSON.toJSONString(venueService.register("123407","97")));
    }

    @Test
    public void writeLayout() throws Exception {
        venueService.writeLayout("123456",0,"hello");
        venueService.writeLayout("123456",1,"hello");
        venueService.writeLayout("123456",2,"hello");
        venueService.writeLayout("123956",2,"hello");
        venueService.writeModifyLayout("123456",0,"hhhhh");
        venueService.getLayouts("123456");
    }

    @Test
    public void testGetStatistics(){
        VenueStatisticsModel venueStatisticsModel = venueService.getStatistics("n222l6B");
        System.out.println(venueStatisticsModel);
    }

}
