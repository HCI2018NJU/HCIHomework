package ticketson.service.serviceimpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import ticketson.dao.CouponRepository;
import ticketson.dao.MemberRepository;
import ticketson.entity.Coupon;
import ticketson.entity.Member;
import ticketson.exception.InvalidRequestException;
import ticketson.model.CouponModel;
import ticketson.service.CouponService;
import ticketson.util.CouponHelper;
import ticketson.model.CouponTypeModel;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by shea on 2018/3/13.
 */
@Service
public class CouponServiceImpl implements CouponService {
    @Autowired
    CouponRepository couponRepository;

    @Autowired
    MemberRepository memberRepository;

    /**
     * 获得可以兑换的优惠券类型
     *
     * @param mid
     * @return
     */
    @Override
    public List<CouponTypeModel> getCouponTypes(long mid) {
        Member member = memberRepository.getOne(mid);
        int credit = member.getCredit();
        List<CouponTypeModel> couponTypeModels = CouponHelper.judgeCoupon(credit);
        return couponTypeModels;
    }

    /**
     * 获得优惠券使用记录，即已经使用过的优惠券
     *
     * @param mid
     * @param page
     * @param pageNum @return
     */
    @Override
    public List<CouponModel> getUsedCoupons(long mid, int page, int pageNum) {
        Pageable pageable = new PageRequest(page,pageNum, Sort.Direction.ASC,"validDateEnd");
        Page<Coupon> couponPage = couponRepository.findByMember_MidAndConsumeTimeIsNotNull(mid,pageable);
        List<Coupon> couponList = couponPage.getContent();
        List<CouponModel> couponModels = new ArrayList<>();
        for(Coupon coupon:couponList){
            CouponModel couponModel = new CouponModel(coupon);
            couponModels.add(couponModel);
        }
        return couponModels;
    }

    /**
     * 获得已经使用过的优惠券数目
     *
     * @param mid
     * @return
     */
    @Override
    public int getUsedCouponTotalNum(long mid) {
        return couponRepository.countByMember_MidAndConsumeTimeIsNotNull(mid);
    }

    /**
     * 获得未使用但未过期的优惠券
     *
     * @param mid
     * @param date
     * @param page
     * @param pageNum @return
     */
    @Override
    public List<CouponModel> getUnusedCoupons(long mid, long date, int page, int pageNum) {
        Pageable pageable = new PageRequest(page,pageNum, Sort.Direction.ASC,"validDateEnd");
        Page<Coupon> couponPage = couponRepository.findByMember_MidAndValidDateEndGreaterThanAndConsumeTimeIsNull(mid,date,pageable);
        List<Coupon> couponList = couponPage.getContent();
        List<CouponModel> couponModels = new ArrayList<>();
        for(Coupon coupon:couponList){
            CouponModel couponModel = new CouponModel(coupon);
            couponModels.add(couponModel);
        }
        return couponModels;
    }

    /**
     * 获得未使用但未过期的优惠券数目
     *
     * @param mid
     * @param date
     * @return
     */
    @Override
    public int getUnusedCouponTotalNum(long mid, long date) {
        return couponRepository.countByMember_MidAndValidDateEndGreaterThanAndConsumeTimeIsNull(mid,date);
    }

    /**
     * 获得未使用且已过期的优惠券
     *
     * @param mid
     * @param date
     * @param page
     * @param pageNum @return
     */
    @Override
    public List<CouponModel> getExpiredCoupons(long mid, long date, int page, int pageNum) {
        Pageable pageable = new PageRequest(page,pageNum, Sort.Direction.ASC,"validDateEnd");
        Page<Coupon> couponPage = couponRepository.findByMember_MidAndValidDateEndLessThanEqualAndConsumeTimeIsNull(mid,date,pageable);
        List<Coupon> couponList = couponPage.getContent();
        List<CouponModel> couponModels = new ArrayList<>();
        for(Coupon coupon:couponList){
            CouponModel couponModel = new CouponModel(coupon);
            couponModels.add(couponModel);
        }
        return couponModels;
    }

    /**
     * 获得未使用且已过期的优惠券数目
     *
     * @param mid
     * @param date
     * @return
     */
    @Override
    public int getExpiredCouponTotalNum(long mid, long date) {
        return couponRepository.countByMember_MidAndValidDateEndLessThanEqualAndConsumeTimeIsNull(mid,date);
    }

    /**
     * 使用积分兑换优惠券
     *
     * @param mid
     * @param type
     * @return
     */
    @Override
    public void exchangeCoupon(long mid, int type) {
        Member member = memberRepository.findOne(mid);
        //根据类型制作优惠券
        Coupon coupon = CouponHelper.makeCoupon(type);
        //判断积分是否足够
        if(member.getCredit()<coupon.getMinCredit()){
            throw new InvalidRequestException("积分不足");
            // 积分足够
        }else {
            coupon.setMember(member);
            //从用户里减去积分
            member.setCredit(member.getCredit()-coupon.getMinCredit());
            couponRepository.save(coupon);
            memberRepository.save(member);

        }
    }

}
