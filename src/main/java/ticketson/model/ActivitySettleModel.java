package ticketson.model;

import ticketson.entity.Activity;
import ticketson.util.DateHelper;
import ticketson.util.ManagerHelper;

import java.text.SimpleDateFormat;

/**
 * Created by shea on 2018/3/15.
 */
public class ActivitySettleModel {
    public long aid;
    public String name;
    public String type;
    public String begin;
    public String end;
    //线上营业额
    public double turnover;
    public double dividend = ManagerHelper.dividend;
    //活动线上净收入，即经理需要给场馆的钱
    public double activityEarn;

    public String vid;

    public ActivitySettleModel(){

    }

    public ActivitySettleModel(Activity activity){
        this.aid = activity.getAid();
        this.name = activity.getName();
        this.type = activity.getType();
        this.begin = DateHelper.format(activity.getBegin());
        this.end = DateHelper.format(activity.getEnd());
        this.turnover = activity.getTurnover();
        this.activityEarn = turnover*(1-dividend);
        this.vid = activity.getVenue().getVid();
    }


}
