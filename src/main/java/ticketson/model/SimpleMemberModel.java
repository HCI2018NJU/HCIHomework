package ticketson.model;

import ticketson.entity.Member;

/**
 * Created by shea on 2018/3/14.
 */
public class SimpleMemberModel {
    public long mid;
    public String nickname;
    public int cityCode;
    public int districtCode;
    public int provinceCode;

    public SimpleMemberModel() {
    }

    public SimpleMemberModel(Member member) {
        this.mid = member.getMid();
        this.nickname = member.getNickname();
        this.cityCode = member.getCityCode();
        this.districtCode = member.getDistrictCode();
        this.provinceCode = member.getProvinceCode();
    }
}
