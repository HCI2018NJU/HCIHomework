package ticketson.controller;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ticketson.model.VenueModel;
import ticketson.model.VenueStatisticsModel;
import ticketson.service.VenueService;

import java.util.List;


/**
 * Created by shea on 2018/2/2.
 * 场馆在设计平面图时，给图中每一个座位设一个layout_sid属性，这是座位的物理id,保存在图中
 */
@RestController
@RequestMapping(value = "/api/venue", produces = "application/json;charset=UTF-8")
public class VenueController {
    @Autowired
    VenueService venueService;

    /**
     * 场馆注册 ==
     * @param name 名称
     * @param psw 密码
     * @param provinceCode 省
     * @param cityCode 市
     * @param districtCode 区
     * @param location 详细地址
     * @return
     */
    @PostMapping("/register")
    public @ResponseBody
    VenueModel register(String name, String psw, int provinceCode, int cityCode, int districtCode, String location){
        return venueService.register(name,psw,provinceCode,cityCode,districtCode,location);
    }

    /**
     * 场馆注册时提交平面图 ==
     * @param vid
     * @param layouts
     * @return
     */
    @PostMapping("/postLayouts")
    public void postLayouts(String vid, String layouts,Integer totalSeats){
        List jsons = JSONArray.parseArray(layouts);
        for(int i=0;i<jsons.size();i++){
            venueService.writeLayout(vid,i,jsons.get(i).toString());
        }
        venueService.setTotalSeats(vid,totalSeats);
    }

    /**
     * 加载场馆的平面图 ==
     * @param vid 场馆ID
     * @return
     */
    @PostMapping("/getLayouts")
    public @ResponseBody String getLayouts(String vid){
        //找到vid_[0-9]的文件，读取内容，写进一个字符串数组
        List<String> layouts = venueService.getLayouts(vid);
        return JSON.toJSONString(layouts);
    }

    /**
     * 场馆登陆 ==
     * @param vid 注册码
     * @param psw 密码
     * @return
     */
    @PostMapping("/login")
    public void login(String vid,String psw) {
        //todo cookie存储登陆状态
        venueService.login(vid,psw);
    }

    /**
     * 场馆修改信息 ==
     */
    @PostMapping("/modifyInfo")
    public void modifyInfo(String vid,String name, int provinceCode, int cityCode, int districtCode, String location) {

        venueService.modifyInfo(vid,name,provinceCode,cityCode,districtCode,location);
    }

    @PostMapping("/getInfo")
    public @ResponseBody VenueModel getInfo(String vid){
        return venueService.getInfo(vid);
    }

    /**
     * 得到场馆统计数据
     * @param vid
     * @return
     */
    @PostMapping("/getStatistics")
    public @ResponseBody
    VenueStatisticsModel getStatistics(String vid){
        return venueService.getStatistics(vid);
    }



}
