package ticketson.model;

import ticketson.entity.Activity;

/**
 * Created by shea on 2018/3/15.
 */
public class SimpleActivityModel {
    public long aid;
    public String name;
    public String type;
    public float lowestPrice;
    public String url;

    public SimpleActivityModel() {
    }

    public SimpleActivityModel(Activity activity) {
        this.aid = activity.getAid();
        this.name = activity.getName();
        this.type = activity.getType();
        this.lowestPrice = activity.getLowestPrice();
        this.url = activity.getUrl();
    }
}
