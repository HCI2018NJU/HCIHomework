package ticketson.model;

import ticketson.entity.Activity;
import ticketson.entity.Period;
import ticketson.util.DateHelper;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by shea on 2018/3/16.
 */
public class SpecificActivityModel {
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


    /**
     * 记录这次活动计划的最后一场的开场时间，自此售票结束
     */
    public String endSell;

    /**
     * 第一场开始时间
     */
    public String begin;

    /**
     * 最后一场结束时间
     */
    public String end;

    public VenueModel venue;

    public List<SimplePeriodModel> periods = new ArrayList<>();

    public SpecificActivityModel() {
    }

    public SpecificActivityModel(Activity activity) {
        this.aid = activity.getAid();
        this.name = activity.getName();
        this.type = activity.getType();
        this.description = activity.getDescription();
        this.url = activity.getUrl();
        this.lowestPrice = activity.getLowestPrice();
        this.prices = activity.getPrices();
        this.turnoverSettled = activity.getTurnoverSettled();
        this.turnover = activity.getTurnover();
        this.endSell = DateHelper.format(activity.getEndSell());
        this.begin = DateHelper.format(activity.getBegin());
        this.end = DateHelper.format(activity.getEnd());
        this.venue = new VenueModel(activity.getVenue());

        List<Period> periodList = activity.getPeriods();
        for (Period period : periodList) {
            SimplePeriodModel simplePeriodModel = new SimplePeriodModel(period);
            periods.add(simplePeriodModel);
        }
    }

}
