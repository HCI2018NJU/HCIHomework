package ticketson.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ticketson.model.*;
import ticketson.service.ActivityService;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * Created by shea on 2018/2/4.
 *
 * 活动的发布和获得
 *
 * 场馆的每一个活动有很多不同的时间段，要为每一个时间段存储一组座位信息，主要是存储可不可售
 * 但是为活动设计的活动平面图只有一份，就是对于同一个物理座位，它在不同时间段其他的属性都是一样的，只有可不可售这个属性不同
 * 在seat数据表中除了有自增的sid，还有pid和layout_sid,所以根据pid和layout_sid，就是可以将物理座位和seat数据表的seat对应起来
 */
@RestController
@RequestMapping(value = "/api/activity", produces = "application/json;charset=UTF-8")
public class ActivityController {

    @Autowired
    ActivityService activityService;

    private static final Logger logger = LoggerFactory.getLogger("ActivityController");
    /**
     * 场馆提交活动基本信息 ==
     * @param vid 场馆注册码
     * @param name 活动名称
     * @param periods 活动的时间段
     * @param type 活动类型
     * @param description 活动描述
     * @return
     */
    @PostMapping("/postInfo")
    public @ResponseBody SpecificActivityModel postInfo(String vid,String name,String type,String fatherType,String description,String periods,String url,String prices){
        List jsons = JSONArray.parseArray(periods);
        logger.info(periods);
        logger.info(jsons.toString());
        String[] periodsParse = new String[jsons.size()];
        for(int i=0;i<jsons.size();i++){
            periodsParse[i] = jsons.get(i).toString();
        }
        return activityService.insertActivity(vid,name,type,fatherType,description,periodsParse,url,prices);
    }

    /**
     * 场馆提交活动海报 ==
     * @param vid
     * @param file
     * @return
     */
    @PostMapping("/postPhoto")
    public @ResponseBody String postPhoto(String vid, MultipartFile file){
        String url = activityService.postPhoto(vid,file);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("url",url);
        return JSON.toJSONString(jsonObject);
    }

    /**
     * 场馆提交活动平面图 ==
     * @param aid 活动编号
     * @param lowestPrice 活动的最低票价
     * @param layouts 带有座位价格等级信息的平面图
     * @param seats 此活动的座位信息
     * @return 返回预计收入和不包含手续费，之间用_链接
     */
    @PostMapping("/postLayouts")
    public void postLayouts(long aid,float lowestPrice,String layouts,String seats){
        //在activity数据表中更新activity记录
        //在period数据表中将periods信息存进去
        //向seat数据表中初始化periods.length组seat记录,初始化为可售,每组seat记录的信息就是seatVos的信息。每组记录初始时不同的只有自增的sid和pid
        //找到文件名为a_aid_lid的文件，没有就创建文件，命名为a_aid_lid,并将layout覆盖写入文件
        List layoutsJsons = JSONArray.parseArray(layouts);
        for(int i=0;i<layoutsJsons.size();i++){
            activityService.writeActivityLayout(aid,i,layoutsJsons.get(i).toString());
        }
        List seatsJsons = JSONArray.parseArray(seats);
        List<SeatModel> seatModels = new ArrayList<>();
        for(int i=0;i<seatsJsons.size();i++){
            SeatModel seatModel = JSON.toJavaObject((JSON) seatsJsons.get(i),SeatModel.class);
            seatModels.add(seatModel);
        }
        activityService.insertActivitySeats(aid,seatModels);
        activityService.setLowestPrice(aid,lowestPrice);
    }

    /**
     * 加载场馆某次活动时间段之下的平面图 ==
     * @param aid 活动ID
     * @return
     */
    @PostMapping("/getLayouts")
    public @ResponseBody String getLayouts(long aid){
        //找寻所有文件名符合a_aid_*的文件，并返回
        return JSON.toJSONString(activityService.getLayouts(aid));
    }

    /**
     * 活动详情 ==
     * @param aid
     * @return
     */
    @PostMapping("/getActivity")
    public @ResponseBody
    SpecificActivityModel getActivity(long aid){
        return activityService.getActivity(aid);
    }

    /**
     * 获得正在卖票的活动(activity中endsell之前的) ==
     * @param page 第几页
     * @param perPage 每页几个活动
     * @return
     */
    @PostMapping("/getActivities")
    public @ResponseBody List<ActivityModel> getActivities(String type,String fatherType,Integer cityCode,Integer timeType,Integer page, Integer perPage) {
        System.out.println(type);
        System.out.println(fatherType);
        System.out.println(cityCode);
        System.out.println(timeType);
        return activityService.getActivities(type,fatherType,cityCode,timeType,page,perPage);
    }

    /**
     * 获得正在售票的活动总数 ==
     * @return
     */
    @PostMapping("/countActivities")
    public int getActivitiesTotalNum(String type,String fatherType,Integer cityCode,Integer timeType){
        System.out.println(type);
        System.out.println(fatherType);
        System.out.println(cityCode);
        System.out.println(timeType);
        return activityService.countActivities(type,fatherType,cityCode,timeType);
    }

    /**
     * 获得正在卖票的活动(activity中endsell之前的) ==
     * @param page 第几页
     * @param perPage 每页几个活动
     * @return
     */
    @PostMapping("/getActivitiesByKeyword")
    public @ResponseBody List<ActivityModel> getActivitiesByKeyword(String keyword,Integer page, Integer perPage) {

        System.out.println(keyword);
        return activityService.getActivitiesByKeyword(keyword,page,perPage);
    }

    /**
     * 获得正在售票的活动总数 ==
     * @return
     */
    @PostMapping("/countActivitiesByKeyword")
    public int getActivitiesTotalNumByKeyword(String keyword){
        System.out.println("countActivitiesByKeyword======"+keyword);
        return activityService.getActivitiesTotalNumByKeyword(keyword);
    }


    /**
     * 根据场馆ID得到活动 ==
     * @param vid
     * @param type -1表示已经结束，0表示进行，1表示尚未开始
     * @param page
     * @param perPage
     * @return
     */
    @PostMapping("/getActivitiesByVid")
    public @ResponseBody List<ActivityModel> getActivitiesByVid(String vid, int type, int page, int perPage){
        List<ActivityModel> activityModels = activityService.getActivitiesByVid(vid,type,page,perPage);
//        System.out.println(activityModels.get(12));
        return activityModels;
    }

    /**
     * 根据场馆ID得到活动数目 ==
     * @param vid
     * @param type -1表示已经结束，0表示进行，1表示尚未开始
     * @return
     */
    @PostMapping("/getActivitiesTotalNumByVid")
    public int getActivitiesTotalNumByVid(String vid,int type){
        return activityService.getActivitiesTotalNumByVid(vid,type);
    }

    @GetMapping("/getStatisticsTotalNum")
    public int getStatisticsTotalNum(String vid){
        return activityService.getStatisticsTotalNum(vid);
    }

    @GetMapping("/getStatistics")
    public @ResponseBody
    List<ActivityStatisticsModel> getStatistics(String vid,int page,int perPage){
        System.out.println(vid);
        return activityService.getStatistics(vid,page,perPage);
    }


}
