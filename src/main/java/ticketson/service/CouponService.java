package ticketson.service;

import ticketson.entity.Coupon;
import ticketson.model.CouponModel;
import ticketson.model.CouponTypeModel;

import java.util.List;

/**
 * Created by shea on 2018/3/13.
 */
public interface CouponService {
    /**
     * 获得可以兑换的优惠券类型
     * @param mid
     * @return
     */
    public List<CouponTypeModel> getCouponTypes(long mid);

    /**
     * 获得优惠券使用记录，即已经使用过的优惠券
     * @param mid
     * @return
     */
    public List<CouponModel> getUsedCoupons(long mid, int page, int pageNum);

    /**
     * 获得已经使用过的优惠券数目
     * @param mid
     * @return
     */
    public int getUsedCouponTotalNum(long mid);

    /**
     * 获得未使用但未过期的优惠券
     * @param mid
     * @param date
     * @return
     */
    public List<CouponModel> getUnusedCoupons(long mid, long date, int page, int pageNum);

    /**
     * 获得未使用但未过期的优惠券数目
     * @param mid
     * @param date
     * @return
     */
    public int getUnusedCouponTotalNum(long mid,long date);

    /**
     * 获得未使用且已过期的优惠券
     * @param mid
     * @param date
     * @return
     */
    public List<CouponModel> getExpiredCoupons(long mid,long date,int page,int pageNum);

    /**
     * 获得未使用且已过期的优惠券数目
     * @param mid
     * @param date
     * @return
     */
    public int getExpiredCouponTotalNum(long mid,long date);

    /**
     * 使用积分兑换优惠券
     * @param mid
     * @param type
     * @return
     */
    public void exchangeCoupon(long mid,int type);
}
