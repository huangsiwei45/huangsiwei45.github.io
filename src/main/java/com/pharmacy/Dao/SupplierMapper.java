package com.pharmacy.Dao;

import com.pharmacy.enity.fee;
import com.pharmacy.enity.medicine;
import com.pharmacy.enity.supplier;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SupplierMapper {

    @Select("select * from supplier where id=#{id}")
   public List<supplier> getSupplierById(int id);

    @Select("select * from supplier")
    public List<supplier> searchAll();

    @Options(useGeneratedKeys = true, keyProperty = "id")
    @Insert("insert into supplier(name,address,phone,scope) values(#{name},#{address},#{phone},#{scope})")
    public int insertSupplier(supplier supplier);

    @Update("update supplier set name =#{name},address=#{address},phone=#{phone},scope=#{scope} where id =#{id}")
    public int updateSupplier(supplier supplier);

    @Delete("DELETE FROM supplier where id =#{id}")
    public int deleteSupplierById(int id);

   @Select("select * from supplier where name=#{name}")
   public List<supplier> getSupplier(String name);

}
