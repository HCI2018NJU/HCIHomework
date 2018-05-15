package ticketson.model;

import com.alibaba.fastjson.JSONObject;
import ticketson.entity.Activity;
import ticketson.entity.Order;
import ticketson.util.ManagerHelper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created by shea on 2018/3/31.
 */
public class VenueStatisticsModel {
    public List<JSONObject> typeData = new ArrayList<>();
    public List<JSONObject> subscribeData = new ArrayList<>();
    public List<String> months ;
    public List<Double> trendData = new ArrayList<>();
    public List<JSONObject> top3 = new ArrayList<>();

    public VenueStatisticsModel() {
    }

    public VenueStatisticsModel(Map<String,Double> trend, Map<String,Double> type, Map<String,Integer> subscribe, List<Activity> top3){
        this.months = trend.keySet().stream().collect(Collectors.toList());
        for(String trendKey:trend.keySet()){
            this.trendData.add(trend.get(trendKey));
        }
        for(String typeKey:type.keySet()){
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name",typeKey);
            jsonObject.put("value",type.get(typeKey));
            this.typeData.add(jsonObject);
        }

        for(String subscribeKey:subscribe.keySet()){
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name",subscribeKey);
            jsonObject.put("value",subscribe.get(subscribeKey));
            this.subscribeData.add(jsonObject);
        }

        top3.forEach(activity->{
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name",activity.getName());
            jsonObject.put("earn",(activity.getTurnover()+activity.getOfflineTurnover())*(1- ManagerHelper.dividend));
            this.top3.add(jsonObject);
        });
    }

    @Override
    public String toString() {
        return "VenueStatisticsModel{" +
                "typeData=" + typeData +
                ", subscribeData=" + subscribeData +
                ", months=" + months +
                ", trendData=" + trendData +
                ", top3=" + top3 +
                '}';
    }
}
