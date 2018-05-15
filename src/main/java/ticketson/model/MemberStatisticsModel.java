package ticketson.model;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import ticketson.entity.Order;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created by shea on 2018/3/19.
 */
public class MemberStatisticsModel {
    public List<JSONObject> typeData = new ArrayList<>();
    public List<JSONObject> subscribeData = new ArrayList<>();
    public List<String> months ;
    public List<Double> trendData = new ArrayList<>();
    public List<SimpleOrderModel> top3 = new ArrayList<>();

    public MemberStatisticsModel() {
    }

    public MemberStatisticsModel(Map<String,Double> trend, Map<String,Double> type, Map<String,Integer> subscribe, List<Order> top3){
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

        top3.forEach(order->{
            this.top3.add(new SimpleOrderModel(order));
        });
    }

    @Override
    public String toString() {
        return "MemberStatisticsModel{" +
                "typeData=" + typeData +
                ", subscribeData=" + subscribeData +
                ", months=" + months +
                ", trendData=" + trendData +
                ",top3"+top3+
                '}';
    }
}