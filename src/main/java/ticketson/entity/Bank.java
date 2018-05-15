package ticketson.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by shea on 2018/2/2.
 */
@Entity
@Table(name = "`bank`")
public class Bank {
    @Id
    @Column(name = "`bid`")
    private Long bid;

    @Column(name = "`psw`")
    private String psw;

    //账户余额
    @Column(name = "`balance`")
    private double balance;

    @Column(name = "`type`")
    private String type;

    public Long getBid() {
        return bid;
    }

    public void setBid(Long bid) {
        this.bid = bid;
    }

    public String getPsw() {
        return psw;
    }

    public void setPsw(String psw) {
        this.psw = psw;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
