package ticketson.model;

import ticketson.entity.Coupon;
import ticketson.util.DateHelper;


/**
 * Created by shea on 2018/3/14.
 * 优惠券
 */
public class CouponModel {
    public long cid;
    /**
     * 优惠券类型序号
     */
    public int type;
    /**
     * 优惠券名称
     */
    public String name;
    /**
     * 优惠金额
     */
    public float minus;
    /**
     * 消费时间
     */
    public String consumeTime;

    /**
     * 适用范围，订单金额满足的最小值
     */
    public float min;

    public int minCredit;

    /**
     * 有效的开始日期
     */
    public String validDateBegin;

    /**
     * 有效的结束日期
     */
    public String validDateEnd;

    public CouponModel() {
    }

    public CouponModel(Coupon coupon){
        this.cid = coupon.getCid();
        this.type = coupon.getType();
        this.name = coupon.getName();
        this.minus = coupon.getMinus();
        this.consumeTime = DateHelper.format(coupon.getConsumeTime());
        this.min = coupon.getMin();
        this.minCredit = coupon.getMinCredit();
        this.validDateBegin = DateHelper.format(coupon.getValidDateBegin());
        this.validDateEnd = DateHelper.format(coupon.getValidDateEnd());
    }

    @Override
    public String toString() {
        return "CouponModel{" +
                "cid=" + cid +
                ", type=" + type +
                ", name='" + name + '\'' +
                ", minus=" + minus +
                ", consumeTime=" + consumeTime +
                ", min=" + min +
                ", minCredit=" + minCredit +
                ", validDateBegin=" + validDateBegin +
                ", validDateEnd=" + validDateEnd +
                '}';
    }
}
