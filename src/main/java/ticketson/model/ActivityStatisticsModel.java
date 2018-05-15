package ticketson.model;

import ticketson.entity.Activity;
import ticketson.entity.Period;
import ticketson.util.ManagerHelper;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by shea on 2018/3/19.
 */
public class ActivityStatisticsModel {
    public long aid;
    public String name;
    public String sellState;

    //线上营业额
    public double turnover;
    //线下营业额
    public double offlineTurnover;
    //线上营业额手续费
    public double fees;
    //活动净收入
    public double earn;

    public String settleState;

    public List<SimplePeriodModel> periods = new ArrayList<>();

    public ActivityStatisticsModel(){

    }

    public ActivityStatisticsModel(Activity activity){
        this.aid = activity.getAid();
        this.name = activity.getName();
        this.turnover = activity.getTurnover();
        this.offlineTurnover = activity.getOfflineTurnover();
        this.fees = turnover*ManagerHelper.dividend;
        this.earn = turnover+offlineTurnover-fees;
        long now = System.currentTimeMillis();
        if(now<activity.getEndSell()){
            sellState = "售票中";
        }else {
            sellState = "结束售票";
        }
        this.settleState = activity.getTurnoverSettled()?"已结算":"未结算";

        List<Period> periodList = activity.getPeriods();
        for(Period period:periodList){
            SimplePeriodModel simplePeriodModel = new SimplePeriodModel(period);
            periods.add(simplePeriodModel);
        }
    }

    @Override
    public String toString() {
        return "ActivityStatisticsModel{" +
                "aid=" + aid +
                ", name='" + name + '\'' +
                ", sellState='" + sellState + '\'' +
                ", turnover=" + turnover +
                ", offlineTurnover=" + offlineTurnover +
                ", fees=" + fees +
                ", earn=" + earn +
                ", settleState='" + settleState + '\'' +
                ", periods=" + periods +
                '}';
    }
}
