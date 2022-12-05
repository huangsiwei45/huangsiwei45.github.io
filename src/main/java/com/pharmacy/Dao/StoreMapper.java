package com.pharmacy.Dao;


import com.pharmacy.enity.medicine;
import com.pharmacy.enity.store;
import com.pharmacy.enity.supplier;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface StoreMapper {

    @Select("select * from store")
    public List<store> searchStore();

    @Select("select * from store where id=#{id}")
    public List<store> getStoreById(int id);

    @Options(useGeneratedKeys = true, keyProperty = "id")
    @Insert("insert into store(medicine,type,number,price,user,date) values(#{medicine},#{type},#{number},#{price},#{user},#{date})")
    public int insertStore(store store);

    @Delete("DELETE FROM store where id =#{id}")
    public int deleteStoreById(int id);

    @Select("select * from store where medicine=#{medicine}")
    public List<store> getStore(String medicine);


}
