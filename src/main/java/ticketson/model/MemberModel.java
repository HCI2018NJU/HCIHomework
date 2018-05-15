package ticketson.model;

import ticketson.entity.Member;

/**
 * Created by shea on 2018/3/15.
 */
public class MemberModel {
    public long mid;
    public int credit;
    public int level;
    public String nickname;
    public int cityCode;
    public int districtCode;
    public int provinceCode;


    public MemberModel() {
    }

    public MemberModel(Member member) {
        this.mid = member.getMid();
        this.credit = member.getCredit();
        this.level = member.getLevel();
        this.nickname = member.getNickname();
        this.cityCode = member.getCityCode();
        this.districtCode = member.getDistrictCode();
        this.provinceCode = member.getProvinceCode();
    }
}
