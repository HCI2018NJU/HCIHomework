package ticketson.model;

import com.alibaba.fastjson.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created by shea on 2018/3/20.
 */
public class ManagerStatisticsModel {
    public List<JSONObject> memberLevelData = new ArrayList<>();
    public List<JSONObject> venueRegisterData = new ArrayList<>();
    public List<String> months ;
    public List<Double> trendSubscribeData = new ArrayList<>();
    public List<Double> trendUnsubscribeData = new ArrayList<>();

    public ManagerStatisticsModel() {
    }

    public ManagerStatisticsModel(Map<String,Double> trendSubscribe,Map<String,Double> trendUnsubscribe,Map<String,Integer> memberLevel, Map<String,Integer> venueRegister){
        this.months = trendSubscribe.keySet().stream().collect(Collectors.toList());
        for(String trendKey:trendSubscribe.keySet()){
            this.trendSubscribeData.add(trendSubscribe.get(trendKey));
            this.trendUnsubscribeData.add(trendUnsubscribe.get(trendKey));
        }

        for(String memberLevelKey:memberLevel.keySet()){
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name",memberLevelKey);
            jsonObject.put("value",memberLevel.get(memberLevelKey));
            this.memberLevelData.add(jsonObject);
        }

        for(String venueRegisterKey:venueRegister.keySet()){
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name",venueRegisterKey);
            jsonObject.put("value",venueRegister.get(venueRegisterKey));
            this.venueRegisterData.add(jsonObject);
        }
    }

    @Override
    public String toString() {
        return "ManagerStatisticsModel{" +
                "memberLevelData=" + memberLevelData +
                ", venueRegisterData=" + venueRegisterData +
                ", months=" + months +
                ", trendSubscribeData=" + trendSubscribeData +
                ", trendUnsubscribeData=" + trendUnsubscribeData +
                '}';
    }
}
