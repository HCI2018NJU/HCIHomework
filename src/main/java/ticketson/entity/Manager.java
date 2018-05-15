package ticketson.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by shea on 2018/3/13.
 */
@Entity
@Table(name = "`manager`")
public class Manager {
    @Id
    @Column(name = "`mnid`")
    private String mnid;

    @Column(name = "`psw`")
    private String psw;

    @Column(name = "`bankPsw`")
    private String bankPsw;

    @Column(name = "`balance`")
    private double balance;

    public String getMnid() {
        return mnid;
    }

    public void setMnid(String mnid) {
        this.mnid = mnid;
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

    public String getBankPsw() {
        return bankPsw;
    }

    public void setBankPsw(String bankPsw) {
        this.bankPsw = bankPsw;
    }
}
