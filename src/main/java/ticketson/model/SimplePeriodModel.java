package ticketson.model;


import ticketson.entity.Period;
import ticketson.util.DateHelper;

/**
 * Created by shea on 2018/3/15.
 */
public class SimplePeriodModel {
    public Long pid;

    public String begin;

    public String end;

    public long beginTime;

    public SimplePeriodModel() {
    }

    public SimplePeriodModel(Period period){
        this.pid = period.getPid();
        this.begin = DateHelper.format(period.getBegin());
        this.end = DateHelper.format(period.getEnd());
        this.beginTime = period.getBegin();
    }
}
