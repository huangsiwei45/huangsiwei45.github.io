package com.pharmacy.Dao;

import com.pharmacy.enity.fee;
import com.pharmacy.enity.store;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface FeeMapper {

    @Select("select * from fee")
    public List<fee> searchFee();

    @Select("select * from fee where id=#{id}")
    public List<fee> getFeeById(int id);

    @Options(useGeneratedKeys = true, keyProperty = "id")
    @Insert("insert into fee(medicine,type,number,price,user,date) values(#{medicine},#{type},#{number},#{price},#{user},#{date})")
    public int insertFee(fee fee);

    @Delete("DELETE FROM fee where id =#{id}")
    public int deleteFeeById(int id);

    @Select("select * from fee where medicine=#{medicine}")
    public List<fee> getFee(String medicine);

}
