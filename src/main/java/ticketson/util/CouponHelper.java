package ticketson.util;

import ticketson.entity.Coupon;
import ticketson.model.CouponTypeModel;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by shea on 2018/2/24.
 */
public class CouponHelper {
    /**
     * 有效时长30天
     */
    private static final long validTime = 1000*60*60*24*30L;
    /**
     * 优惠券需满足的金额
     */
    private static final float[] min = {100,500,1000,2000,3000};
    /**
     * 优惠额度
     */
    private static final float[] minus = {5,30,80,180,280};
    /**
     * 兑换优惠券需要的积分
     */
    private static final int[] minCredits = {500,2500,5000,10000,15000};
    /**
     * 优惠券名称
     */
    private static final String[] name = {"TicketsOn满百减五","TicketsOn满五百减三十","TicketsOn满一千减八十","TicketsOn满两千减一百八","TicketsOn满三千减二百八"};

    /**
     * 根据现有积分返回可以兑换的优惠券
     * @param credit 现有积分
     * @return
     */
    public static List<CouponTypeModel> judgeCoupon(int credit){
        List<CouponTypeModel> couponTypeModels = new ArrayList<>();
        for(int i=0;i<minCredits.length;i++){
            if(credit>minCredits[i]){
                CouponTypeModel couponTypeModel = new CouponTypeModel(i,name[i],minCredits[i],min[i],minus[i]);
                couponTypeModels.add(couponTypeModel);
            }
        }
        return couponTypeModels;
    }

    /**
     * 制作优惠券
     * @param type
     * @return
     */
    public static Coupon makeCoupon(int type){
        Coupon coupon = new Coupon();
        coupon.setMinus(minus[type]);
        coupon.setMin(min[type]);
        coupon.setName(name[type]);
        coupon.setType(type);
        coupon.setMinCredit(minCredits[type]);
        long validBegin = System.currentTimeMillis();
        long validEnd = validBegin+validTime;
        coupon.setValidDateBegin(validBegin);
        coupon.setValidDateEnd(validEnd);
        return coupon;
    }
}
