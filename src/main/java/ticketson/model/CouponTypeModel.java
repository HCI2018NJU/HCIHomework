package ticketson.model;

import ticketson.entity.Coupon;

/**
 * Created by shea on 2018/2/24.
 */
public class CouponTypeModel {
    public int type;
    public String name;
    //兑换将消耗多少积分
    public int minCredit;
    //订单金额满多少可以使用
    public float min;
    //优惠多少
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
