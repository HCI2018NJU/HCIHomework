package ticketson.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import ticketson.entity.Coupon;
import ticketson.model.CouponModel;
import ticketson.service.CouponService;
import ticketson.model.CouponTypeModel;

import java.util.List;

/**
 * Created by shea on 2018/3/13.
 */
@RestController
@RequestMapping(value = "/api/coupon", produces = "application/json;charset=UTF-8")
public class CouponController {
    @Autowired
    CouponService couponService;
    /**
     * 获得可以兑换的优惠券类型
     * @param mid
     * @return
     */
    @PostMapping("/getCouponTypes")
    public @ResponseBody
    List<CouponTypeModel> getCouponTypes(long mid){
        return couponService.getCouponTypes(mid);
    }

    /**
     * 获得已经使用的优惠券总数
     * @param mid
     * @return
     */
    @PostMapping("/getUsedCouponTotalNum")
    public int getUsedCouponTotalNum(long mid){
        return couponService.getUsedCouponTotalNum(mid);
    }

    /**
     * 获得已经使用的优惠券
     * @param mid
     * @param page
     * @param pageNum
     * @return
     */
    @PostMapping("/getUsedCoupons")
    public @ResponseBody List<CouponModel> getUsedCoupons(long mid, int page, int pageNum){
        return couponService.getUsedCoupons(mid,page,pageNum);
    }

    /**
     * 获得未使用且未过期的优惠券
     * @param mid
     * @param page
     * @param pageNum
     * @return
     */
    @PostMapping("/getUnusedCoupons")
    public @ResponseBody List<CouponModel> getUnusedCoupons(long mid,long date,int page,int pageNum){
        return couponService.getUnusedCoupons(mid,date,page,pageNum);
    }

    /**
     * 获得已经使用的优惠券总数
     * @param mid
     * @return
     */
    @PostMapping("/getUnusedCouponTotalNum")
    public int getUnusedCouponTotalNum(long mid,long date){
        return couponService.getUnusedCouponTotalNum(mid,date);
    }



    /**
     * 获得已经使用的优惠券总数
     * @param mid
     * @return
     */
    @PostMapping("/getExpiredCouponTotalNum")
    public int getExpiredCouponTotalNum(long mid,long date){
        return couponService.getExpiredCouponTotalNum(mid,date);
    }

    /**
     * 获得已经使用的优惠券
     * @param mid
     * @param page
     * @param pageNum
     * @return
     */
    @PostMapping("/getExpiredCoupons")
    public @ResponseBody List<CouponModel> getExpiredCoupons(long mid,long date,int page,int pageNum){
        return couponService.getExpiredCoupons(mid,date,page,pageNum);
    }

    /**
     * 兑换优惠券
     * @param mid
     * @param type
     * @return
     */
    @PostMapping("/exchangeCoupon")
    public void exchangeCoupon(long mid,int type){
        couponService.exchangeCoupon(mid,type);
    }

}
