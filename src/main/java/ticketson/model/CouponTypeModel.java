package ticketson.model;

import ticketson.entity.Coupon;

/**
 * Created by shea on 2018/2/24.
 */
public class CouponTypeModel {
    public int type;
    public String name;
    public int minCredit;
    public float min;
    public float minus;

    public CouponTypeModel() {
    }

    public CouponTypeModel(int type, String name, int minCredit, float min, float minus) {
        this.type = type;
        this.name = name;
        this.minCredit = minCredit;
        this.min = min;
        this.minus = minus;
    }

}
