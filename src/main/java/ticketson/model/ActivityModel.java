package ticketson.model;

import ticketson.entity.Activity;
import ticketson.entity.Period;
import ticketson.util.DateHelper;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by shea on 2018/3/15.
 */
public class ActivityModel {

    public Long aid;

    public String name;

    public String type;

    public String description;

    /**
     * 海报图片
     */
    public String url;

    public float lowestPrice;

    /**
     * 例如 _1200_800_400
     */
    public String prices;

    /**
     * 营业额是否已经结算
     */
    public boolean turnoverSettled;

    /**
     * 营业额
     */
    public double turnover;

    public double offlineTurnover;


    /**
     * 记录这次活动计划的最后一场的开场时间，自此售票结束
     */
    public long endSell;

    /**
     * 第一场开始时间
     */
    public String begin;

    /**
     * 最后一场结束时间
     */
    public String end;

    public List<SimplePeriodModel> periods = new ArrayList<>();

    public String vname;

    public int tnum;

    public String fatherType;
    public int pageView;
    public int cityCode;


    public ActivityModel() {
    }

    public ActivityModel(Activity activity){
        this.aid = activity.getAid();
        this.name = activity.getName();
        this.type = activity.getType();
        this.description = activity.getDescription();
        this.url = activity.getUrl();
        this.lowestPrice = activity.getLowestPrice();
        this.prices = activity.getPrices();
        this.turnoverSettled = activity.getTurnoverSettled();
        this.turnover = activity.getTurnover();
        this.offlineTurnover = activity.getOfflineTurnover();
        this.endSell = activity.getEndSell();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy.MM.dd HH:mm");
        this.begin = dateFormat.format(activity.getBegin());
        this.end = dateFormat.format(activity.getEnd());
        this.vname = activity.getVname();
        this.tnum = activity.getTnum();
        this.fatherType = activity.getFatherType();
        this.cityCode = activity.getCityCode();
        this.pageView = activity.getPageView();
        
        List<Period> periodList = activity.getPeriods();
        for(Period period:periodList){
            SimplePeriodModel simplePeriodModel = new SimplePeriodModel(period);
            periods.add(simplePeriodModel);
        }
    }

    @Override
    public String toString() {
        return "ActivityModel{" +
                "aid=" + aid +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", description='" + description + '\'' +
                ", url='" + url + '\'' +
                ", lowestPrice=" + lowestPrice +
                ", prices='" + prices + '\'' +
                ", turnoverSettled=" + turnoverSettled +
                ", turnover=" + turnover +
                ", offlineTurnover=" + offlineTurnover +
                ", endSell=" + endSell +
                ", begin='" + begin + '\'' +
                ", end='" + end + '\'' +
                ", periods=" + periods +
                '}';
    }
}
